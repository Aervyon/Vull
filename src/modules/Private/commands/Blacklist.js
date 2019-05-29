import { Command, Resolver } from 'axoncore';

class Blacklist extends Command {
    constructor(module) {
        super(module);
        this.label = 'blacklist';

        this.infos = {
            owners: ['Null'],
            description: ['Blacklist a guild or user from the bot'],
            usage: 'blacklist [user or guild]',
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
            if (!!this.axon.AxonUtils.isBotOwner(Resolved.id) || this.axon.AxonUtils.isBotAdmin(Resolved.id) ) return this.sendError(msg.channel, 'Bot staff cannot be blacklisted!');
            if (axon.bannedUsers && axon.bannedUsers.length > 0) {
                if (axon.bannedUsers.includes(Resolved.id) ) return this.sendMessage(msg.channel, 'User is already blacklisted!');
                arr = axon.bannedUsers.concat( [Resolved.id] );
            }
            arr = arr || [Resolved.id];
            axon = await this.axon.DBprovider.updateBlacklistUser(arr);
            if (!axon.bannedUsers.includes(Resolved.id) ) return this.sendError(msg.channel, 'Something went wrong while blacklisting');
            this.axon.blacklistedUsers.add(Resolved.id);
            message = `Blacklisted ${user.username}#${user.discriminator}`;
        }
        if (type === 'guild') {
            if (axon.bannedGuilds && axon.bannedGuilds.length > 0) {
                if (axon.bannedGuilds.includes(Resolved.id) ) return this.sendMessage(msg.channel, 'Guild is already blacklisted!');
                arr = axon.bannedGuilds.concat( [Resolved.id] );
            }
            arr = arr || [Resolved.id];
            axon = await this.axon.DBprovider.updateBlacklistGuild(arr);
            if (!axon.bannedGuilds.includes(Resolved.id) ) return this.sendError(msg.channel, 'Something went wrong while blacklisting');
            this.axon.blacklistedGuilds.add(Resolved.id);
            message = `Blacklisted ${Resolved.name}`;
        }
        return this.sendSuccess(msg.channel, message);
    }
}

export default Blacklist;
