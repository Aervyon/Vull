import { Command } from 'axoncore';

import Add from './Add';
import Remove from './Remove';

class Protected extends Command {
    constructor(module) {
        super(module);
        this.label = 'protected';

        this.infos = {
            owners: ['Null'],
            description: 'Manage/view protected roles',
        };

        this.options.guildOnly = true;

        this.permissions.bot = ['embedLinks', 'sendMessages'];
        this.permissions.user.needed = ['manageGuild', 'administrator'];

        this.hasSubcmd = true;
        this.subcmds = [Add, Remove];
    }

    execute( { msg, guildConf } ) {
        if (!guildConf.protectedRoles || guildConf.protectedRoles.length === 0) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('protected_none', { guildConf } ) );

        let aroles = guildConf.protectedRoles;
        aroles = msg.channel.guild.roles.filter(r => aroles.includes(r.id) );
        const roles = aroles.map(r => r.mention);

        for (const role of guildConf.protectedRoles) {
            if (!msg.channel.guild.roles.get(role) ) roles.push(`[Invalid-role ${role}]`);
        }

        if (!roles || roles.length === 0) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('protected_none', { guildConf } ) );

        let color = this.axon.configs.template.embed.colors.help;
        if (msg.channel.guild.roles && msg.channel.guild.roles.size > 0) {
            let rroles = msg.channel.guild.roles.filter(r => r.color !== 0);
            rroles = this.axon.Utils.sortRoles(rroles);
            color = rroles[0].color || color;
        }

        return this.sendMessage(msg.channel, {
            embed: {
                title: this.axon.LangClass.fetchSnippet('protected_for', { guildConf, guild: msg.channel.guild } ),
                color,
                description: roles.join('\n'),
            },
        } );
    }
}

export default Protected;
