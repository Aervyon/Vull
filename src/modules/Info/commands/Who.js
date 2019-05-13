import { Command, Resolver, Enums } from 'axoncore';
import moment from 'moment';

class Who extends Command {
    constructor(module) {
        super(module);
        this.label = 'who';
        this.aliases = ['whois', 'userinfo'];

        this.infos = {
            owner: ['Null'],
            description: 'Get some info on a user',
            usage: 'whois (user)',
            examples: ['whois', 'whois Null'],
        };

        this.importantPerms = [
            'manageEmojis',
            'manageRoles',
            'manageNicknames',
            'banMembers',
            'mentionEveryone',
            'manageWebhooks',
            'manageChannels',
            'manageMessages',
            'kickMembers',
        ];
    }

    acknowledgements(member, guildConf) {
        const acks = [];
        if (this.axon.AxonUtils.isAdmin(member) ) {
            acks.push('Server Administrator');
        } else if (this.axon.AxonUtils.isMod(member, guildConf) ) {
            acks.push('Server Moderator');
        }

        if (member.id === '323673862971588609') {
            acks.push('Developer');
        }

        if (this.axon.AxonUtils.isBotOwner(member.id) ) {
            acks.push('Bot Owner');
        } else if (this.axon.AxonUtils.isBotAdmin(member.id) ) {
            acks.push('Bot Admin');
        }
        return acks;
    }

    getPerms(member) {
        const perms = [];
        for (let perm of this.importantPerms) {
            if (member.permission.has(perm) ) {
                perm = Enums.permissionsNames[perm];
                perms.push(perm);
            }
        }
        return perms;
    }

    execute( { msg, args, guildConf } ) {
        let mem = msg.member;
        if (args[0] ) {
            mem = Resolver.member(msg.channel.guild, args.join(' ') );
            if (!mem) {
                return this.sendMessage(msg.channel, `${this.axon.configs.template.emote.error} User not found!`);
            }
        }
        const acks = this.acknowledgements(mem, guildConf);
        const base = {
            title: `Userinfo ${mem.user.username}`,
            description: mem.mention,
            fields: [
                {
                    name: 'Status',
                    value: mem.status,
                    inline: true,
                },
                {
                    name: 'Joined At',
                    value: moment(mem.joinedAt).format('ddd, MMMM Do YYYY [at] h:m:s A'),
                    inline: true,
                },
                {
                    name: 'Registered At',
                    value: moment(mem.createdAt).format('ddd, MMMM Do YYYY [at] h:m:s A'),
                    inline: true,
                },
            ],
            thumbnail: {
                url: mem.avatarURL,
            },
            footer: {
                text: `ID: ${mem.id}`,
            },
            timestamp: new Date(),
        };
        if (mem.nick && mem.nick !== mem.user.username) {
            base.fields.push( {
                name: 'Nickname',
                value: mem.nick,
                inline: true,
            } );
        }
        if (mem.game) {
            const types = {
                0: 'Playing',
                1: 'Streaming on Twitch',
                2: 'Listening to',
                3: 'Watching',
            };
            const type = types[mem.game.type];
            const details = mem.game.details
                ? `\n${mem.game.details}`
                : '';
            const full = `${type} ${mem.game.name} ${details}`;
            base.fields.push( {
                name: 'Game',
                value: full,
                inline: true,
            } );
        }

        if (!acks.includes('Server Administrator') && mem.permission.allow > 0) {
            const perms = this.getPerms(mem);
            if (perms.length > 0) {
                base.fields.push( {
                    name: `Permissions`,
                    value: perms.join(', '),
                    inline: true,
                } );
            }
        }

        if (mem.roles && mem.roles.length > 0) {
            let roles = msg.channel.guild.roles.filter(r => mem.roles.includes(r.id) );
            roles = this.axon.Utils.sortRoles(roles);
            base.color = roles[0].color || null;
            const rolz = [];
            for (const role of roles) {
                rolz.push(role.mention);
            }
            base.fields.push( {
                name: `Roles [${mem.roles.length}]`,
                value: rolz.join(', '),
                inline: true,
            } );
        }
        if (acks.length > 0) {
            base.fields.push( {
                name: 'Acknowledgements',
                value: acks.join(', '),
                inline: true,
            } );
        }
        return this.sendMessage(msg.channel, { embed: base } );
    }
}

export default Who;
