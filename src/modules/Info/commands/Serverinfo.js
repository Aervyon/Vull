import { Command } from 'axoncore';
import moment from 'moment';

class Serverinfo extends Command {
    constructor(module) {
        super(module);
        this.label = 'serverinfo';

        this.infos = {
            owners: ['Null'],
            description: 'Get the servers information',
        };
    }

    execute( { msg } ) {
        const own = msg.channel.guild.members.get(msg.channel.guild.ownerID); // Define own as the guild owner
    
        const name = own.nick
            ? `${own.user.username}#${own.user.discriminator} A.K.A ${own.nick}`
            : `${own.user.username}#${own.user.discriminator}`;
        const icon = msg.channel.guild.iconURL;
        let color = this.axon.configs.template.embed.colors.help;
        if (msg.channel.guild.roles && msg.channel.guild.roles.size > 0) {
            let roles = msg.channel.guild.roles.filter(r => r.color !== 0);
            roles = this.axon.Utils.sortRoles(roles);
            color = roles[0].color || color;
        }
        return this.sendMessage(msg.channel, { // Create a message
            embed: { // The message embed
                color, // The embed color
                description: `**Owner:** ${name}`, // The embed description
                fields: [ // The embed fields
                    {
                        name: 'Region',
                        value: msg.channel.guild.region,
                        inline: true,
                    },
                    {
                        name: 'ID',
                        value: msg.channel.guild.id,
                        inline: true,
                    },
                    {
                        name: 'Text Channels',
                        value: msg.channel.guild.channels.filter(channel => channel.type === 0).length,
                        inline: true,
                    },
                    {
                        name: 'Voice Channels',
                        value: msg.channel.guild.channels.filter(channel => channel.type === 2).length,
                        inline: true,
                    },
                    {
                        name: 'Categorys',
                        value: msg.channel.guild.channels.filter(channel => channel.type === 4).length,
                        inline: true,
                    },
                    {
                        name: 'Roles',
                        value: msg.channel.guild.roles.map(role => role).length,
                        inline: true,
                    },
                    {
                        name: 'Members',
                        value: msg.channel.guild.members.map(members => members).length,
                        inline: true,
                    },
                    {
                        name: 'Humans',
                        value: msg.channel.guild.members.filter(members => !members.bot).length,
                        inline: true,
                    },
                    {
                        name: 'Bots',
                        value: msg.channel.guild.members.filter(members => members.bot).length,
                        inline: true,
                    },
                ],
                footer: { text: `${msg.channel.guild.name} was created ${moment(msg.channel.guild.createdAt).format('MMMM Do YYYY, h:mm:ss A')}` }, // The footer. When the guild was created
                thumbnail: { url: icon }, // The guild icon
                author: {
                    name: msg.channel.guild.name, // The author for the embed
                    icon_url: icon,
                },
            },
        } );
    }
}

export default Serverinfo;
