import { Command, Resolver } from 'axoncore';

class Unblacklist extends Command {
    constructor(module) {
        super(module);
        this.label = 'unblacklist';

        this.infos = {
            owners: ['Null'],
            description: 'Unblacklist a guild or user from the bot',
            usage: 'unblacklist [user or guild]',
            examples: ['blacklist Null', 'blacklist Library of Code'],
        };

        this.permissions.staff.needed = this.axon.staff.admins;
        this.permissions.staff.bypass = this.axon.staff.owners;

        this.options.argsMin = 1;
    }

    async execute( { msg, args } ) {
        let Resolved = Resolver.member(msg.channel.guild, args.join(' ') ) || Resolver.user(this.axon.client, args.join(' ') );
        let type = 'user';
        if (!Resolved) {
            if (args[0].match(/^\d+$/) ) {
                Resolved = await this.axon.client.getRESTUser(args[0] ).catch( () => { /* --- */ } );
            }
            if (!Resolved) {
                Resolved = Resolver.guild(this.axon.client, args);
                type = 'guild';
            }
        }
        if (!Resolved) return this.sendError(msg.channel, 'User/Guild not found!');
        let axon = await this.axon.fetchAxonConf();
        let message,
            arr;
        if (type === 'user') {
            const user = Resolved.user || Resolved;
            if (axon.bannedUsers && axon.bannedUsers.length > 0) {
                if (!axon.bannedUsers.includes(Resolved.id) ) return this.sendMessage(msg.channel, 'User is not blacklisted!');
                arr = axon.bannedUsers.filter(u => u !== Resolved.id);
                axon = await this.axon.DBprovider.updateBlacklistUser(arr);
                if (axon.bannedUsers.includes(Resolved.id) ) return this.sendError(msg.channel, 'Something went wrong while blacklisting');
                this.axon.blacklistedUsers.delete(Resolved.id);
                message = `Unblacklisted ${user.username}#${user.discriminator}`;
            } else {
                this.sendError(msg.channel, 'No users blacklisted!');
            }
        }
        if (type === 'guild') {
            if (axon.bannedGuilds && axon.bannedGuilds.length > 0) {
                if (!axon.bannedGuilds.includes(Resolved.id) ) return this.sendMessage(msg.channel, 'Guild is not blacklisted!');
                arr = axon.bannedGuilds.filter(g => g !== Resolved.id);
                axon = await this.axon.DBprovider.updateBlacklistGuild(arr);
                if (axon.bannedGuilds.includes(Resolved.id) ) return this.sendError(msg.channel, 'Something went wrong while blacklisting');
                this.axon.blacklistedGuilds.delete(Resolved.id);
                message = `Unblacklisted ${Resolved.name}`;
            }
        }
        return this.sendSuccess(msg.channel, message);
    }
}

export default Unblacklist;
