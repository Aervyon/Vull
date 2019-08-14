import { Command, Resolver } from 'axoncore';

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
        const role = Resolver.role(msg.channel.guild, args);
        if (!role) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('role_notfound_custom', { guildConf, custom: args.join(' ') } ) );

        let roles = guildConf.protectedRoles;
        if (!guildConf.protectedRoles || !Array.isArray(guildConf.protectedRoles) ) roles = [];

        const maxRoleLength = 40;
        if (roles.length >= maxRoleLength) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('protected_limit', { guildConf } ) );

        if (roles.includes(role.id) ) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('protected_already', { guildConf } ) );

        roles = roles.concat( [role.id] );

        guildConf.protectedRoles = roles;
        this.axon.updateGuildConf(msg.channel.guild.id, guildConf);

        return this.sendSuccess(msg.channel, this.axon.LangClass.fetchSnippet('protected_added', { guildConf, custom: role.name } ) );
    }
}

export default Add;
