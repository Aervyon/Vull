import { Command } from 'axoncore';

class Off extends Command {
    constructor(module) {
        super(module);
        this.label = 'on';
        this.aliases = ['enable'];

        this.infos = {
            owners: ['Null'],
            description: 'Disable modlogs',
            usage: 'on',
        };

        this.isSubcmd = true;

        this.permissions.serverAdmin = true;
        this.options.guildOnly = true;
    }

    async execute( { msg, guildConf } ) {
        if (guildConf.modLogStatus) return this.sendError(msg.channel, 'Modlogs were never disabled.');
        guildConf.modLogStatus = true;
        this.axon.updateGuildConf(msg.channel.id, guildConf);
        guildConf = await this.axon.getGuildConf(msg.channel.guild.id);
        if (!guildConf.modLogStatus) return this.sendError(msg.channel, 'Something went wrong while enabling your modlog status');
        return this.sendSuccess(msg.channel, 'Modlogs enabled!');
    }
}

export default Off;
