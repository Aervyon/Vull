import { Command, Resolver } from 'axoncore';

class Warn extends Command {
    constructor(module) {
        super(module);
        this.label = 'warn';

        this.infos = {
            owners: ['Null'],
            description: 'Command to warn users',
            usage: 'warn [user] [reason]',
            examples: ['warn Null Watch your tongue in my server.'],
        };

        this.permissions.serverMod = true;
        this.permissions.bot = ['sendMessages', 'manageMessages'];
        this.options.argsMin = 2;
        this.options.guildOnly = true;
    }

    async execute( { msg, args, guildConf } ) {
        msg.delete();

        const user = Resolver.member(msg.channel.guild, args[0] );
        if (!user) this.sendError(msg.channel, 'User not found!');

        if (this.axon.AxonUtils.isAdmin(user) || this.axon.AxonUtils.isMod(user, guildConf) ) {
            return this.sendError(msg.channel, 'That user is a mod/admin!');
        }
        if (user.roles && guildConf.protectedRoles && guildConf.protectedRoles.length > 0) {
            for (const role of guildConf.protectedRoles) {
                const check = user.roles.includes(role);
                if (check) return this.sendError(msg.channel, 'User is protected!');
            }
        }

        const reason = args.slice(1).join(' ');
        let message = `***Warned ${user.user.username}#${user.user.discriminator}***`;
        try {
            const dmChan = await this.axon.client.getDMChannel(user.id);
            await this.axon.sendMessage(dmChan, `You were warned in \`${msg.channel.guild.name}\`: ${reason}`);
        } catch (err) {
            const er = err.message || err;
            if (er.match(/Cannot send messages to this user$/) ) message = 'Could not DM user. Logged warn.';
            message = '***Could not DM user (Unkown Error). Logged warn.***';
        }
        if (!guildConf.cases || !(guildConf.cases instanceof Array) ) {
            guildConf.cases = [];
        }
        const modcase = {
            mod: msg.member.id, user: user.user.id, reason, id: String(guildConf.cases.length + 1), type: 'warn',
        };
        if (guildConf.modLogStatus) {
            this.axon.client.emit('moderation', { modcase, guildConf } );
        } else {
            guildConf.cases.push(modcase);
            this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        }

        return this.sendSuccess(msg.channel, message);
    }
}

export default Warn;
