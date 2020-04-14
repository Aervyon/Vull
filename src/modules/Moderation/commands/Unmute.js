import { Command, Resolver } from 'axoncore';

class Unmute extends Command {
    constructor(module) {
        super(module);
        this.label = 'unmute';

        this.infos = {
            owners: ['Null'],
            description: 'Unmute a user in the server',
            usage: 'unmute [user] [time] (reason)',
            examples: ['unmute Null Appealed', 'unmute Null'],
        };

        this.permissions.serverMod = true;
        this.permissions.bot = [
            'manageRoles',
            'sendMessages',
            'manageMessages',
        ];

        this.options.guildOnly = true;
        this.options.argsMin = 1;
    }

    async execute( { msg, args, guildConf } ) {
        const user = Resolver.member(msg.channel.guild, args[0] );
        if (!user) return this.sendError(msg.channel, 'User not found!');
        const modcase = guildConf.cases.find(cas => cas.user === user.id && cas.status === 'muted');
        if (!modcase) return this.sendError(msg.channel, `${user.user.username} is not muted!`);
        const reason = args.slice(1).join(' ') || 'No reason';
        const index = guildConf.cases.indexOf(modcase);

        if (!guildConf.mutedRole) return this.sendError(msg.channel, 'Cannot find the muted role (Vull Database)!');
        const role = msg.channel.guild.roles.get(guildConf.mutedRole);
        if (!role) return this.sendError(msg.channel, 'Cannot find the muted role (Server)!');
        msg.delete();
        user.removeRole(guildConf.mutedRole, reason);
        modcase.status = null;
        guildConf.cases.fill(modcase, index, index);
        const nmodcase = {
            mod: msg.author.id, user: user.id, reason, id: String(guildConf.cases.length + 1), type: 'unmute', unmutedAt: new Date(),
        };

        if (guildConf.modLogStatus) this.axon.client.emit('moderation', { modcase: nmodcase, guildConf } );
        else {
            guildConf.cases.push(nmodcase);
            this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        }
        return this.sendSuccess(msg.channel, `**Unmuted ${user.user.username}#${user.user.discriminator}!**`);
    }
}

export default Unmute;
