/* eslint-disable @typescript-eslint/no-unused-vars */
import nodeUtil from 'util';

import {
    Command,
    CommandPermissions,
    CommandOptions,
    CommandResponse,
    AxonEnums,
    DiscordEnums,
    Collection,
    Embed,
    Prompt,
    MessageCollector,
    Stack,
    Queue,
    FunctionQueue,
    AutoQueue,
    AsyncQueue,
    Module,
    CommandEnvironment,
} from 'axoncore';
import Eris, { TextableChannel } from 'eris';

class Eval extends Command {
    constructor(module: Module) {
        super(module);

        this.label = 'eval';
        this.aliases = ['eval', 'e'];

        this.info = {
            owners: ['KhaaZ', 'VoidNulll'],
            name: 'eval',
            description: 'Eval js code.',
            usage: 'eval [js code]',
            examples: ['eval 1 + 1'],
        };

        this.options = new CommandOptions(this, {
            argsMin: 1,
            cooldown: 0,
        } );
        
        this.permissions = new CommandPermissions(this, {
            staff: {
                needed: this.axon.staff.owners,
                bypass: this.axon.staff.owners,
            },
        } );
    }

    async execute(env: CommandEnvironment): Promise<CommandResponse> {
        const { msg, args, guildConfig } = env;
        let depth = 0;
        if ( ['--depth', '-d'].includes(args[0] ) ) {
            args.shift();
            if (!isNaN(Number(args[0] ) ) ) {
                depth = Number(args[0] );
            }
            args.shift();
        }
        let evalString;
        const evString = args.join(' ').split('\n').reverse();
        evString[0] = `return ${evString[0]}`;
        const evalInp = evString.reverse().join('\n');
        try {
            // eslint-disable-next-line no-eval
            evalString = await eval(`(async () => { ${evalInp} })()`);

            if (typeof evalString === 'object') {
                evalString = nodeUtil.inspect(evalString, { depth, showHidden: true } );
            } else {
                evalString = String(evalString);
            }
        } catch (err) {
            this.logger.debug(err.stack);
            return this.sendError(msg.channel, err.message ? err.message : `Error: \`\`\`js\n${err}\`\`\`Check logs for more information.`);
        }

        evalString = this.cleanUpToken(evalString);

        if (evalString.length === 0) {
            return this.sendError(msg.channel, 'Error 404: Output.html not found.');
        }

        const splitEvaled = evalString.match(/[\s\S]{1,1900}[\n\r]/g) || [evalString];
        
        if (splitEvaled.length > 3) {
            this.sendMessage(msg.channel, `Cut the response! [3/${splitEvaled.length} | ${evalString.length} chars]`);
        }
        
        for (let i = 0; i < 3; i++) {
            if (!splitEvaled[i] ) {
                break;
            }
            this.sendCode(msg.channel, splitEvaled[i] );
        }
        return new CommandResponse( {
            success: true,
        } );
    }

    cleanUpToken(evalString: string): string {
        return evalString.replace(new RegExp(this.bot.token!, 'g'), 'Vull Arin');
    }

    sendCode(channel: TextableChannel, content: string, lang = 'js'): Promise<Eris.Message> {
        return this.sendMessage(channel, `\`\`\`${lang}\n${content}\`\`\``);
    }
}

export default Eval;
