import { Command } from 'axoncore';
import { inspect } from 'util';
import Guild from '../../../../models/Guild';

class Eval extends Command {
    constructor(module) {
        super(module);
        this.label = 'eval';
        this.aliases = ['e', 'evaluate'];

        this.infos = {
            owner: ['Null'],
            description: 'Eval some code',
            usage: 'eval [code]',
            example: 'eval this.axon',
        };

        this.enabled = true;
        this.serverBypass = true;

        this.permissions.staff.needed = this.axon.staff.owners;

        this.hasSubcmd = false;
    }

    async execute( { msg, args, /* eslint-disable */ guildConf /*eslnt-enable*/ } ) {
        let errored = 0;
        let evaled;
        try {
            evaled = await eval(args.join(' ') );
            switch (typeof evaled) {
                case 'object': {
                    evaled = inspect(evaled, { depth: 0, showHidden: true });
                    break;
                }
                default: {
                    evaled = String(evaled);
                }
            }

            if (evaled.length === 0 || !evaled) {
                errored = 1;
                return this.sendMessage(msg.channel, 'No output!');
            }

            evaled = evaled.split(this.axon.client.token).join('NO TOKEN');

            if (evaled.length > 2000) {
                evaled = evaled.match(/[\s\S]{1,1900}[\n\r]/g) || [];
                try {
                    if (evaled.length >= 3) {
                        this.sendMessage(msg.channel, `\`\`\`js\n${evaled[0]}\`\`\``);
                        this.sendMessage(msg.channel, `\`\`\`js\n${evaled[1]}\`\`\``);
                        this.sendMessage(msg.channel, `\`\`\`js\n${evaled[2]}\`\`\``);
                    } else {
                        evaled.forEach((message) => {
                            this.sendMessage(msg.channel, `\`\`\`js\n${message}\`\`\``);
                        })
                    }
                    return Promise.resolve();
                } catch (err) {
                    errored = 1;
                    console.log('Something happened! See below');
                    console.error(err);
                    return Promise.resolve()
                }
            }
        } catch (err) {
            errored = 1;
            return this.sendMessage(msg.channel, `Eval errored. Check below\n${err.message || err}`);
        } finally {
            if (errored > 0) return Promise.resolve();
            return this.sendMessage(msg.channel, `\`\`\`js\n${evaled}\`\`\``);
        }
    }
}

export default Eval;
