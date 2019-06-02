import { Command, Resolver } from 'axoncore';

class Ban extends Command {
    constructor(module) {
        super(module);
        this.label = 'kick';

        this.infos = {
            name: 'kick',
            description: 'Kick a user via the bot',
            usage: 'Kick [user] (reason)',
            examples: ['Kick Null Get out!'],
        };

        this.permissions.serverMod = true;
        this.options.guildOnly = true;
        this.options.argsMin = 1;

        this.permissions.bot = [
            'kickMembers',
            'sendMessages',
        ];
    }

    async execute( { msg, args, guildConf } ) {
        const user = Resolver.member(msg.channel.guild, args[0] );
        if (!user) return this.sendError(msg.channel, 'Member not found!');
        if (this.axon.AxonUtils.isAdmin(user) || this.axon.AxonUtils.isMod(user, guildConf) ) {
            return this.sendError(msg.channel, 'That user is a mod/admin!');
        }
        if (user.roles && guildConf.protectedRoles && guildConf.protectedRoles.length > 0) {
            for (const role of guildConf.protectedRoles) {
                const check = user.roles.includes(role);
                if (check) return this.sendError(msg.channel, 'User is protected!');
            }
        }
        msg.delete().catch( () => { /* --- */ } );

        const reason = args[1] ? args.slice(1).join(' ') : 'No reason';

        try {
            await msg.channel.guild.kickMember(user.id, reason);
        } catch (err) {
            const er = err.message || err;
            if (er.match(/Missing Permissions$/) ) return this.sendError(msg.channel, 'I do not have the permissions to do that!');
            return this.sendError(msg.channel, 'AN unexpected error occured while kicking that member!');
        }

        if (!guildConf.cases || !(guildConf.cases instanceof Array) ) {
            guildConf.cases = [];
        }
        const modcase = {
            mod: msg.member, user: user.user, reason, id: String(guildConf.cases.length + 1), type: 'kick',
        };
        if (guildConf.modLogStatus) {
            this.axon.client.emit('moderation', { modcase, guildConf } );
        } else {
            guildConf.cases.push(modcase);
            this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        }
        return this.sendSuccess(msg.channel, `***Kicked ${user.user.username}#${user.user.discriminator} (${user.id})!***`);
    }
}

export default Ban;
