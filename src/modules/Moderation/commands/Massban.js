/* eslint-disable no-magic-numbers */
import { Command, Resolver } from 'axoncore';

class Massban extends Command {
    constructor(module) {
        super(module);
        this.label = 'massban';

        this.infos = {
            owners: ['Null'],
            description: 'Ban a mass of IDs from the server',
            usage: ['massban [ids] (| reason)'],
            examples: ['massban 323673862971588609 576628262521012254 | Heck outta here', 'massban 323673862971588609 576628262521012254'],
        };

        this.permissions.bot = ['banMembers', 'sendMessages'];
        this.permissions.serverAdmin = true;

        this.options.guildOnly = true;
        this.options.argsMin = 1;
    }

    async execute( { msg, args, guildConf } ) {
        if (!this.axon.AxonUtils.isAdmin(msg.member) ) return this.sendError(msg.channel, 'Only server admins/managers may use this command!');
        args = args.join(' ').split(' | ');
        const ids = args[0].split(' ');
        const reason = args[1] || 'No Reason';

        msg.delete().catch( () => { /* -- */ } );

        if (ids.length === 1) return this.sendError(msg.channel, 'You must supply more than one person to ban');
        if (ids.length > 20) return this.sendError(msg.channel, 'Too many users.');

        const users = [];
        for (const id of ids) {
            let add = true;
            let user = Resolver.member(msg.channel.guild, id) || Resolver.user(this.axon.client, id);
            if (!user && id.match(/^\d+$/) ) {
                user = await this.axon.client.getRESTUser(id)
                    .catch( () => {
                        add = false;
                    } );
            }
            if (!user) add = false;
            if (add && user.joinedAt) {
                if (this.axon.AxonUtils.isAdmin(user) || this.axon.AxonUtils.isMod(user, guildConf) ) {
                    add = false;
                }
                if (user.roles && guildConf.protectedRoles && guildConf.protectedRoles.length > 0) {
                    for (const role of guildConf.protectedRoles) {
                        const check = user.roles.includes(role);
                        add = !check;
                    }
                }
            }
            if (add) users.push(user.id);
        }

        if (users.length === 0) return this.sendError(msg.channel, 'User(s) not found!');

        let success = 0;
        let errored = 0;
        let startID,
            modcase;
        const descrip = `${this.axon.configs.template.emote.loading} Massbanning...`;
        const message = await this.sendMessage(msg.channel, descrip);
        for (const user of users) {
            const startError = errored;
            try {
                await msg.channel.guild.banMember(user, 7, reason);
                success++;
                message.edit(`${descrip} (${success}/${users.length})`);
                await this.axon.Utils.sleep(1000);
            } catch (e) {
                errored++;
            }
            if (errored === startError) {
                const id = String(guildConf.cases.length + 1);
                modcase = {
                    mod: msg.member.id, user, reason, id, type: 'massban',
                };
                guildConf.cases.push(modcase);
                if (!startID) startID = id;
            }
        }
        if (success > 0) this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        let desc = success > 0 ? `**Banned** \`${success}\` members` : 'Failed to ban any members';
        if (errored > 0 && desc !== '**Failed** to ban any members') desc += `\nFailed to ban \`${errored}\` members`;
        if (desc !== 'Failed to ban any members') desc += `\n**Out** of \`${ids.length}\` members`;

        if (guildConf.modLogStatus && success > 0) {
            modcase.id = startID !== modcase.id ? `${startID} - ${modcase.id}` : modcase.id;
            this.axon.client.emit('moderation', { modcase, guildConf } );
        }

        let color = this.axon.configs.template.embed.colors.help;
        if (msg.channel.guild.roles && msg.channel.guild.roles.size > 0) {
            let roles = msg.channel.guild.roles.filter(r => r.color !== 0);
            roles = this.axon.Utils.sortRoles(roles);
            color = roles[0].color || color;
        }

        return message.edit( {
            content: '',
            embed: {
                title: 'Massban complete',
                description: desc,
                color,
            },
        } );
    }
}

export default Massban;
