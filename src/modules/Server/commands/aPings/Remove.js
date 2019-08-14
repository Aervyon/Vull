import { Command, Resolver } from 'axoncore';

class Remove extends Command {
    constructor(module) {
        super(module);
        this.label = 'remove';

        this.aliases = ['off'];
        this.infos = {
            owners: ['Null'],
            description: 'Remove yourself from apings',
            name: 'apings remove',
            usage: 'apings remove',
        };

        this.isSubcmd = true;
        this.guildOnly = true;
    }

    async execute( { msg, args, guildConf } ) {
        if (!guildConf.apings) return this.sendError(msg.channel, 'aPings is not set up! Contact a system administrator to set it up for you!');

        if (!guildConf.apings.channel || !guildConf.apings.status) return this.sendError(msg.channel, 'aPings is disabled!');

        let { mention } = msg.member;

        let interjection = 'you';

        if (args[0] ) {
            if (this.axon.AxonUtils.isMod(msg.member, guildConf) || this.axon.AxonUtils.isAdmin(msg.member) || this.axon.AxonUtils.isBotAdmin(msg.member.id) ) {
                const member = Resolver.member(msg.channel.guild, args[0] );
                if (!member) return this.sendError(msg.channel, 'Member not found!');
                interjection = `${member.user.username}#${member.user.discriminator}`;
                // eslint-disable-next-line prefer-destructuring
                mention = member.mention;
            } else {
                return this.sendError(msg.channel, 'You do not have the permissions to do this!');
            }
        }

        let users = guildConf.apings.users || [];

        if (!users.includes(mention) ) return this.sendError(msg.channel, `${interjection} are not subscribed to aPings!`);

        users = users.filter(m => m !== mention);

        const Guild = this.axon.schemas.get('guildSchema');

        const { channel, status, cooldownUsers } = guildConf.apings;

        guildConf.apings.users = users;
        await this.axon.DBprovider.saveGuildSchema(msg.channel.guild.id, guildConf);
        await Guild.findOneAndUpdate( { guildID: msg.channel.guild.id }, { $set: { apings: { users, channel, status, cooldownUsers } } } );
        return this.sendSuccess(msg.channel, `Unsubscribed ${interjection} from apings!`);
    }
}

export default Remove;
