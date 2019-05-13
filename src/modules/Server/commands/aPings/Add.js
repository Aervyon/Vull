import { Command } from 'axoncore';

class Add extends Command {
    constructor(module) {
        super(module);
        this.label = 'add';

        this.aliases = ['on'];
        this.infos = {
            owners: ['Null'],
            description: 'Add yourself to apings',
            name: 'apings add',
            usage: 'apings add',
        };

        this.isSubcmd = true;
        this.guildOnly = true;
    }

    async execute( { msg, guildConf } ) {
        if (!guildConf.apings) return this.sendError(msg.channel, 'aPings is not set up! Contact a system administrator to set it up for you!');

        if (!guildConf.apings.channel || !guildConf.apings.status) return this.sendError(msg.channel, 'aPings is disabled!');

        const users = guildConf.apings.users || [];

        if (users.includes(msg.member.mention) ) return this.sendError(msg.channel, 'You are already subscribed to aPings!');

        users.push(msg.member.mention);

        const Guild = this.axon.schemas.get('guildSchema');

        const { channel, status, cooldownUsers } = guildConf.apings;

        await Guild.findOneAndUpdate( { guildID: msg.channel.guild.id }, { $set: { apings: { users, channel, status, cooldownUsers } } } );
        return this.sendSuccess(msg.channel, 'Subscribed you to apings!');
    }
}

export default Add;
