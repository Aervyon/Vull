import { Command, Resolver } from 'axoncore';

import On from './On';
import Off from './Off';
import View from './View';

class Modlog extends Command {
    constructor(module) {
        super(module);
        this.label = 'modlogs';

        this.hasSubcmd = true;
        this.subcmds = [
            On,
            Off,
            View,
        ];

        this.infos = {
            owners: ['Null'],
            description: 'Manage modlogs',
            usage: 'modlogs [channel] (status)',
            examples: ['modlogs #vull_modlogs', 'modlogs #vull_modlogs enable'],
        };

        this.permissions.serverAdmin = true;
    }

    async execute( { msg, args, guildConf } ) {
        if (!args[0] ) return this.subCommands.get('view').execute( { msg, guildConf } );
        const channel = Resolver.channel(msg.channel.guild, args[0] );
        if (!guildConf.cases) {
            guildConf.cases = new Map();
            this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
            guildConf = await this.axon.getGuildConf(msg.channel.guild.id);
        }
        if (guildConf.modLogChannel && guildConf.modLogChannel === channel.id && !args[1] ) return this.sendError(msg.channel, 'Mod log channel already set!');
        guildConf.modLogChannel = channel.id;
        if ( [undefined, null].includes(guildConf.modLogStatus) ) {
            if (args[1] && args[1] !== 'disable') {
                guildConf.modLogStatus = true;
            } else if (!args[1] ) guildConf.modLogStatus = true;
        }
        if (args[1] ) {
            const types = { enable: true, disable: false };
            const status = types[args[1]];
            if (!status) return this.sendError(msg.channel, 'Invalid status!');
            guildConf.modLogChannel = status;
        }
        this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        guildConf = await this.axon.getGuildConf(msg.channel.guild.id);
        if (!guildConf.modLogChannel) {
            this.sendError(msg.channel, 'Error updating your guild config!');
            throw Error(`Could not update guild config (mod log channel)!`);
        }
        return this.sendSuccess(msg.channel, 'Set your modlog channel!');
    }
}

export default Modlog;
