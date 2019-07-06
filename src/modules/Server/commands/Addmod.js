import { Command, Resolver } from 'axoncore';

class Addmod extends Command {
    constructor(module) {
        super(module);
        this.label = 'addmod';

        this.infos = {
            owners: ['Null'],
            description: 'Add a moderator as user/role',
            usage: 'addmod [user or role]',
            examples: ['addmod Null', 'addmod Moderator'],
        };

        this.permissions.serverAdmin = true;
        this.options.guildOnly = true;
        this.options.argsMin = 1;
    }

    async execute( { msg, args, guildConf } ) {
        let resolved = Resolver.member(msg.channel.guild, args.join(' ') );
        let type = 'user';
        if (!resolved) {
            resolved = Resolver.role(msg.channel.guild, args.join(' ') );
            if (resolved) type = 'role';
        }
        if (!resolved) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('role_user_notfound', { guildConf } ) );
        if (type === 'user') {
            if (guildConf.modUsers.includes(resolved.id) ) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('addmod_already_user', { guildConf, user: resolved } ) );
            guildConf.modUsers.push(resolved.id);
        } else if (type === 'role') {
            if (guildConf.modRoles.includes(resolved.id) ) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('addmod_already_role', { guildConf, custom: resolved.name } ) );
            guildConf.modRoles.push(resolved.id);
        }

        await this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        let adj = 'user';
        if (type === 'role') {
            adj = 'Role';
        }
        const name = type === 'user' ? `${resolved.user.username}#${resolved.user.discriminator}` : resolved.name;
        return this.sendSuccess(msg.channel, this.axon.LangClass.fetchSnippet('addmod_added', { guildConf, custom: [adj, name] } ) );
    }
}

export default Addmod;
