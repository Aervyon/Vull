import { Command, Prompt } from 'axoncore';

class Guilds extends Command {
    constructor(module) {
        super(module);
        this.label = 'guilds';
        this.aliases = ['servers'];

        this.infos = {
            name: 'guilds',
            owner: ['Null'],
            description: 'Show bot guilds',
        };

        this.permissions.staff.needed = this.axon.staff.admins;
        this.permissions.staff.bypass = this.axon.staff.owners;
    }

    async execute( { msg } ) {
        let guilds = this.axon.client.guilds.map(g => `${g.name} (${g.id})`);
        guilds = guilds.join('\n');
        // eslint-disable-next-line no-magic-numbers
        if (guilds.length > 1900) {
            guilds = this.axon.Utils.splitMessage(guilds);
        }

        this.sendMessage(msg.channel, `\`\`\`\n${guilds}\`\`\``);

        if (!this.axon.AxonUtils.isBotOwner(msg.author.id) ) return Promise.resolve();

        const prompt = new Prompt(this.axon, msg.author.id, msg.channel, {
            deletePrompt: false,
            deleteTimeoutMsg: 10000,
            timeoutTime: 60000,
        } );

        let endPrompt;

        try {
            endPrompt = await prompt.run('Tell me a guild to leave (ID), or say `null`');
        } catch (err) {
            const mesg = err.message || err;
            if (mesg === 'TIMEOUT') {
                return Promise.resolve();
            }
            throw Error(`Prompt Error - ${mesg}`);
        }

        if (!endPrompt) return Promise.resolve();

        if (endPrompt.content === 'null') {
            return this.sendMessage(msg.channel, 'Not leaving a guild!');
        }

        if (!endPrompt.content.match(this.axon.Utils.id) ) {
            return this.sendMessage(msg.channel, 'Invalid guild id!');
        }

        await this.axon.client.leaveGuild(endPrompt.content);

        try {
            const mess = await this.sendMessage(msg.channel, `Left guild with a ID of \`${endPrompt.content}\``);
            return mess;
        } catch (err) {
            console.log(`Unable to send success left guild message in ${msg.channel.id}! Error:\n${err.message || err}`);
            return Promise.resolve();
        }
    }
}

export default Guilds;
