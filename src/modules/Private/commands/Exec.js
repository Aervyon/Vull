import { promisify } from 'util';
// eslint-disable-next-line camelcase
import child_process from 'child_process';
import { Command } from 'axoncore';
const exec = promisify(child_process.exec);

class Execute extends Command {
    constructor(module) {
        super(module);
        this.label = 'exec';

        this.infos = {
            owners: ['Null'],
            description: 'Execute a terminal command',
            usage: 'exec [command]',
            examples: ['exec cd .. && rm -rf Vull-1.5'],
        };

        this.permissions.staff.needed = this.axon.staff.owners;
        this.options.argsMin = 1;
    }

    async execute( { msg, args } ) {
        const message = await this.sendMessage(msg.channel, `Executing \`${args.join(' ')}\``);

        let errored = false;
        let endOut;

        try {
            const out = await exec(args.join(' ') );
            endOut = out.stdout;
        } catch (err) {
            errored = true;
            endOut = err.message || err;
        }

        if (!endOut) return this.sendError(msg.channel, 'No output');

        // eslint-disable-next-line no-magic-numbers
        if (endOut.length > 1900) {
            endOut = this.axon.AxonUtils.splitMessage(endOut);
        }
        message.edit(!errored ? `Output for ${args.join(' ')}:` : 'An error occured. See error below:');

        return this.sendMessage(msg.channel, `\`\`\`sh\n${endOut}\`\`\``);
    }
}

export default Execute;
