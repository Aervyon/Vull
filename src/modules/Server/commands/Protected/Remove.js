import { Command } from 'axoncore';

class Remove extends Command {
    constructor(module) {
        super(module);
        this.label = 'remove';

        this.infos = {
            owners: ['Null'],
            description: 'Remove a role from the protected roles',
            usage: 'protected remove [role]',
            examples: ['protected remove Members'],
            name: 'protected remove',
        };

        this.options.guildOnly = true;

        this.permissions.bot = ['embedLinks', 'sendMessages'];
        this.permissions.user.needed = ['manageGuild', 'administrator'];

        this.options.argsMin = 1;

        this.isSubcmd = true;

        this.idReg = /^[0-9]+$/;
    }

    execute( { msg, args, guildConf } ) {
        let roles = guildConf.protectedRoles;
        if (!guildConf.protectedRoles || !Array.isArray(guildConf.protectedRoles) ) roles = [];

        if (!roles || roles.length === 0) return this.sendError(msg.channel, 'No protected roles found');

        let role = this.axon.Resolver.role(msg.channel.guild, args);
        if (!role) {
            if (args[0].match(this.idReg) ) role = (roles.includes(args[0] ) && args[0] );
            if (!role) return this.sendError(msg.channel, `Role \`${args.join(' ')}\` not found!`);
        }

        const id = role instanceof Object ? role.id : role;
        const called = role instanceof Object ? role.name : role;

        roles = roles.filter(r => r !== id);
        guildConf.protectedRoles = roles;
        this.axon.updateGuildConf(msg.channel.guild.id, guildConf);

        return this.sendSuccess(msg.channel, `Removed \`${called}\` from the protected roles list!`);
    }
}

export default Remove;
