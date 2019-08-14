import { Command, Resolver } from 'axoncore';

import BanMatch from './Ban_match';

class Ban extends Command {
    constructor(module) {
        super(module);
        this.label = 'ban';

        this.infos = {
            name: 'ban',
            description: 'Ban a user via the bot',
            usage: 'ban [user] (reason)',
            examples: ['ban Null Get out!'],
        };

        this.permissions.serverMod = true;
        this.options.guildOnly = true;
        this.options.argsMin = 1;

        this.hasSubcmd = true;
        this.subcmds = [BanMatch];

        this.permissions.bot = ['banMembers', 'sendMessages'];
    }

    async execute( { msg, args, guildConf } ) {
        let user = Resolver.member(msg.channel.guild, args[0] ) || Resolver.user(this.axon.client, args[0] );
        if (!user && args[0].match(/^\d+$/) ) {
            user = await this.axon.client.getRESTUser(args[0] )
                .catch( (err) => {
                    const er = err.message || err;
                    if (er.match(/is not snowflake.$/) ) {
                        return this.sendError(msg.channel, 'User not found. Invalid ID');
                    }
                    if (er.match(/Unknown User$/) ) {
                        return this.sendError(msg.channel, 'User not found.');
                    }
                    return this.sendError(msg.channel, 'An unexpected error occured while finding that user');
                } );
        }
        if (!user) {
            return this.sendError(msg.channel, 'User not found!');
        }
        msg.delete().catch( () => { /* --- */ } );

        const reason = args[1] ? args.slice(1)
            .join(' ') : 'No Reason';
        if (user.joinedAt) {
            if (this.axon.AxonUtils.isAdmin(user) || this.axon.AxonUtils.isMod(user, guildConf) ) {
                return this.sendError(msg.channel, 'That user is a mod/admin!');
            }
            if (user.roles && guildConf.protectedRoles && guildConf.protectedRoles.length > 0) {
                for (const role of guildConf.protectedRoles) {
                    const check = user.roles.includes(role);
                    if (check) return this.sendError(msg.channel, 'User is protected!');
                }
            }
        }

        try {
            await msg.channel.guild.banMember(user.id, 7, reason);
        } catch (err) {
            const er = err.message || err;
            if (er.match(/Missing Permissions$/) ) return this.sendError(msg.channel, 'I do not have the permissions to ban that user!');
            return this.sendError(msg.channel, 'Unexpected error occured while banning that user!');
        }
        if (!guildConf.cases || !(guildConf.cases instanceof Array) ) {
            guildConf.cases = [];
        }
        user = user.user || user;
        const modcase = {
            mod: msg.member.id,
            user: user.id,
            reason,
            id: String(guildConf.cases.length + 1),
            type: 'ban',
        };
        if (guildConf.modLogStatus) {
            this.axon.client.emit('moderation', {
                modcase,
                guildConf,
            } );
        } else {
            guildConf.cases.push(modcase);
            this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        }
        return this.sendSuccess(msg.channel, `***Swung the ban hammer on ${user.username}#${user.discriminator} (${user.id})!***`);
    }
}

export default Ban;
