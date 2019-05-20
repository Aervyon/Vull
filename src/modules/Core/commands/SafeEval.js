/* eslint-disable consistent-return */
import { Command, Resolver } from 'axoncore';
import { VM } from 'vm2';
import util from 'util';
import moment from 'moment';

class SafeEval extends Command {
    constructor(module) {
        super(module);
        this.label = 'safeeval';
        this.aliases = ['se', 'seval'];

        this.infos = {
            owners: ['Null'],
            description: 'Eval in a sandbox',
            usage: 'safeeval [code]',
            examle: 'safeeval msg.author',
        };

        this.bannedWords = [
            'shard',
            'token',
            'createMessage',
            'sendMessage',
        ];
    }

    checker(msg, args) {
        if (!args || !args[0] ) {
            return this.sendHelp(msg);
        }
        for (const banned of this.bannedWords) {
            const check = args.filter(arg => arg.includes(banned) );
            if (check) {
                return this.sendError(msg.channel, 'No');
            }
        }
        return;
    }

    async execute( { msg, args } ) {
        const check = await this.checker(msg, args);
        if (check) {
            return;
        }

        try {
            const vm = new VM( {
                sandbox: {
                    util, Resolver, msg, args, moment,
                },
            } );

            let evaled = await vm.run(args.join(' ') );
            if (!evaled) {
                return this.sendError(msg.channel, 'SafeEval gave no output');
            }
            switch (typeof evaled) {
                case 'object': {
                    evaled = util.inspect(evaled, { depth: 0, showHidden: true } );
                    break;
                }
                default: {
                    evaled = String(evaled);
                }
            }
            if (evaled.length >= 2000) {
                evaled = evaled.match(/[\s\S]{1,1900}[\n\r]/g) || [];
                if (evaled.length > 3) {
                    this.sendMessage(msg.channel, `\`\`\`js\n${evaled[0]}\`\`\``);
                    this.sendMessage(msg.channel, `\`\`\`js\n${evaled[0]}\`\`\``);
                    return this.sendMessage(msg.channel, `\`\`\`js\n${evaled[0]}\`\`\``);
                }
                for (const evale of evaled) {
                    this.sendMessage(msg.channel, `\`\`\`js\n${evale}\`\`\``);
                }
                return Promise.resolve();
            }
            return this.sendMessage(msg.channel, `\`\`\`${evaled}\`\`\``);
        } catch (err) {
            let er = err.message || err;
            if (er === 'DiscordRESTError [50001]: Missing Access') return Promise.resolve();
            if (er.length >= 2000) {
                er = this.axon.Utils.splitMessage(er);
            }
            this.sendError(msg.channel, 'An error occured. Check below');
            return this.sendMessage(msg.channel, `\`\`\`js\n${er}\`\`\``);
        }
    }
}

export default SafeEval;
