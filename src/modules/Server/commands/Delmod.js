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
        if (!resolved) return this.sendError(msg.channel, 'Could not find the user or role!');
        if (type === 'user') {
            if (!guildConf.modUsers.includes(resolved.id) ) return this.sendError(msg.channel, 'User is not a moderator');
            guildConf.modUsers = guildConf.modUsers.filter(m => m !== resolved.id);
        } else if (type === 'role') {
            if (!guildConf.modRoles.includes(resolved.id) ) return this.sendError(msg.channel, 'Role is not a moderator!');
            guildConf.modRoles = guildConf.modRoles.filter(m => m !== resolved.id);
        }

        const gConf = await this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        let adj = 'user';
        if (type === 'User' && gConf.modUsers.includes(resolved.id) ) return this.sendError(msg.channel, 'Something went wrong when removing them from the moderator list!');
        if (type === 'role') {
            adj = 'Role';
            if (!gConf.modRoles.includes(resolved.id) ) return this.sendError(msg.channel, 'Something went wrong when removing the role from the moderator list!');
        }
        return this.sendSuccess(msg.channel, `Removed ${adj} from the moderator list!`);
    }
}

export default Delmod;
