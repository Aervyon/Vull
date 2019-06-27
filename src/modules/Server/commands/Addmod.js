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
        if (!resolved) return this.sendError(msg.channel, 'Could not find the user or role!');
        if (type === 'user') {
            if (guildConf.modUsers.includes(resolved.id) ) return this.sendError(msg.channel, 'User is already a moderator');
            guildConf.modUsers.push(resolved.id);
        } else if (type === 'role') {
            if (guildConf.modRoles.includes(resolved.id) ) return this.sendError(msg.channel, 'Role is already a moderator!');
            guildConf.modRoles.push(resolved.id);
        }

        await this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        let adj = 'user';
        if (type === 'role') {
            adj = 'Role';
        }
        return this.sendSuccess(msg.channel, `Added ${adj} to the moderator list!`);
    }
}

export default Addmod;
