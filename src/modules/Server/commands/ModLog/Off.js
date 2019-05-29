import { Command } from 'axoncore';

class Off extends Command {
    constructor(module) {
        super(module);
        this.label = 'off';
        this.aliases = ['disable'];

        this.infos = {
            owners: ['Null'],
            description: 'Disable modlogs',
            usage: 'off',
        };

        this.isSubcmd = true;

        this.permissions.serverAdmin = true;
        this.options.guildOnly = true;
    }

    async execute( { msg, guildConf } ) {
        if (!guildConf.modLogStatus) return this.sendError(msg.channel, 'Modlogs were never enabled.');
        guildConf.modLogStatus = false;
        this.axon.updateGuildConf(msg.channel.id, guildConf);
        guildConf = await this.axon.getGuildConf(msg.channel.guild.id);
        if (guildConf.modLogStatus) return this.sendError(msg.channel, 'Something went wrong while disabling your modlog status');
        return this.sendSuccess(msg.channel, 'Modlogs disabled!');
    }
}

export default Off;
