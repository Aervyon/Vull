import { Command, Resolver } from 'axoncore';

class Avatar extends Command {
    constructor(module) {
        super(module);
        this.label = 'avatar';
        this.aliases = ['av'];

        this.infos = {
            owners: ['Null'],
            description: 'Show off a avatar',
            usage: 'avatar (user)',
            examples: ['avatar Null', 'avatar'],
        };
    }

    execute( { msg, args } ) {
        let user = msg.member;
        if (args[0] ) {
            user = Resolver.member(msg.channel.guild, args[0] );
            if (!user) this.sendError(msg.channel, 'User not found!');
        }
        let color = this.axon.configs.template.embed.colors.help;
        if (user.roles && user.roles.length > 0) {
            let roles = msg.channel.guild.roles.filter(r => user.roles.includes(r.id) );
            roles = this.axon.Utils.sortRoles(roles);
            const ncolor = roles.find(r => r.color !== 0);
            color = (ncolor && ncolor.color) || color;
        }
        return this.sendMessage(msg.channel, {
            embed: {
                image: { url: user.avatarURL },
                title: 'Avatar',
                color,
                footer: { text: `${user.user.username}#${user.user.discriminator}`, icon_url: user.avatarURL },
                timestamp: new Date(),
            },
        } );
    }
}

export default Avatar;
