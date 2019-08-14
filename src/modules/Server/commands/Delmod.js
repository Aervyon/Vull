import { Command, Resolver } from 'axoncore';

class Delmod extends Command {
    constructor(module) {
        super(module);
        this.label = 'delmod';

        this.infos = {
            owners: ['Null'],
            description: 'Remove a moderator',
            usage: 'delmod [user or role]',
            examples: ['delmod Null', 'delmod Moderator'],
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
            if (!guildConf.modUsers.includes(resolved.id) ) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('delmod_not_user', { guildConf, user: resolved } ) );
            guildConf.modUsers = guildConf.modUsers.filter(m => m !== resolved.id);
        } else if (type === 'role') {
            if (!guildConf.modRoles.includes(resolved.id) ) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('delmod_not_role', { guildConf, custom: resolved.name } ) );
            guildConf.modRoles = guildConf.modRoles.filter(m => m !== resolved.id);
        }

        await this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        let adj = 'user';
        if (type === 'role') {
            adj = 'Role';
        }
        const name = type === 'user' ? `${resolved.user.username}#${resolved.user.discriminator}` : resolved.name;
        return this.sendSuccess(msg.channel, this.axon.LangClass.fetchSnippet('delmod_removed', { guildConf, custom: [adj, name] } ) );
    }
}

export default Delmod;
