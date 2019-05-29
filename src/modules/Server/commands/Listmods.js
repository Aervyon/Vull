import { Command } from 'axoncore';

class Listmods extends Command {
    constructor(module) {
        super(module);
        this.label = 'listmods';
        this.aliases = ['lm'];

        this.infos = {
            owners: ['Null'],
            description: 'List server moderators',
        };

        this.permissions.serverAdmin = true;

        this.options.guildOnly = true;
    }

    execute( { msg, guildConf } ) {
        const mroles = [];
        const users = [];

        if (guildConf.modRoles) {
            for (const r of guildConf.modRoles) {
                const role = msg.channel.guild.roles.get(r);
                if (role) {
                    mroles.push(role.mention);
                } else {
                    mroles.push(`deleted-role [${r}]`);
                }
            }
        }
        if (guildConf.modUsers) {
            for (const m of guildConf.modUsers) {
                const member = msg.channel.guild.members.get(m);
                if (member) {
                    users.push(`${member.user.username}#${member.user.discriminator}`);
                } else {
                    users.push(`deleted-user [${m}]`);
                }
            }
        }
        if ( (!mroles && !users) || (mroles.length === 0 && users.length === 0) ) return this.sendMessage(msg.channel, 'No moderators found for this server!');
        let color = this.axon.configs.template.embed.colors.help;
        if (msg.channel.guild.roles && msg.channel.guild.roles.size > 0) {
            let roles = msg.channel.guild.roles.filter(r => r.color !== 0);
            roles = this.axon.Utils.sortRoles(roles);
            color = roles[0].color || color;
        }
        const embed = {
            title: `Moderators for ${msg.channel.guild.name}`,
            color,
            fields: [],
        };
        if (users.length > 0) {
            embed.fields.push( {
                name: 'Users',
                value: users.join('\n'),
            } );
        }
        if (mroles.length > 0) {
            embed.fields.push( {
                name: 'Roles',
                value: mroles.join('\n'),
            } );
        }
        return this.sendMessage(msg.channel, { embed } );
    }
}

export default Listmods;
