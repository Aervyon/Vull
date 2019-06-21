import { Command } from 'axoncore';

class Add extends Command {
    constructor(module) {
        super(module);
        this.label = 'add';

        this.infos = {
            owners: ['Null'],
            description: 'Add a role to protected roles',
            usage: 'protected add [role]',
            examples: ['protected add Members'],
            name: 'protected add',
        };

        this.options.guildOnly = true;

        this.permissions.bot = ['embedLinks', 'sendMessages'];
        this.permissions.user.needed = ['manageGuild', 'administrator'];

        this.options.argsMin = 1;

        this.isSubcmd = true;
    }

    execute( { msg, args, guildConf } ) {
        const role = this.axon.Resolver.role(msg.channel.guild, args);
        if (!role) return this.sendError(msg.channel, `Role ${args.join(' ')} not found!`);

        let roles = guildConf.protectedRoles;
        if (!guildConf.protectedRoles || !Array.isArray(guildConf.protectedRoles) ) roles = [];

        if (roles.length >= 40) return this.sendError(msg.channel, 'Protected roles limit reached! Cannot add role');

        if (roles.includes(role.id) ) return this.sendError(msg.channel, 'That role is already protected!');

        roles = roles.concat( [role.id] );

        guildConf.protectedRoles = roles;
        this.axon.updateGuildConf(msg.channel.guild.id, guildConf);

        return this.sendSuccess(msg.channel, `Added \`${role.name}\` to the protected roles list!`);
    }
}

export default Add;
