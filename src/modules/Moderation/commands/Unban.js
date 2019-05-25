import { Command, Resolver } from 'axoncore';

class Unban extends Command {
    constructor(module) {
        super(module);
        this.label = 'unban';

        this.infos = {
            owners: ['Null'],
            description: 'Unban a user from the guild.',
            usage: 'unban [user/userid] (reason)',
            examples: [
                'unban Null Appealed',
                'unban 323673862971588609 He was joking',
                'unban 323673862971588609',
            ],
        };

        this.permissions.serverMod = true;
        this.permissions.bot = [
            'sendMessages',
            'manageMessages',
            'banMembers',
        ];
        this.options.argsMin = 1;
        this.options.guildOnly = true;
    }

    async execute( { msg, args, guildConf } ) {
        let user = Resolver.user(this.axon.client, args[0] );
        if (!user && args[0].match(/^\d+$/) ) {
            user = await this.axon.client.getRESTUser(args[0] )
                .catch( (err) => {
                    const er = err.message || err;
                    if (er.match(/is not snowflake.$/) ) {
                        return this.sendError(msg.channel, 'User not found. Invalid ID');
                    }
                    if (er.match(/Unknown User$/) ) {
                        return this.sendError(msg.channel, 'User not found.');
                    }
                    return this.sendError(msg.channel, 'An unexpected error occured while finding that user');
                } );
        }
        if (!user) return this.sendError(msg.channel, 'User not found!');

        msg.delete();

        const reason = args.slice(1).join(' ') || 'No reason';
        if (!guildConf.cases || !(guildConf.cases instanceof Array) ) {
            guildConf.cases = [];
        }
        msg.channel.guild.unbanMember(user.id, reason);
        const modcase = {
            mod: msg.member.id, user: user.id, reason, id: String(guildConf.cases.length + 1), type: 'unban',
        };
        if (guildConf.modLogStatus) {
            this.axon.client.emit('moderation', { modcase, guildConf } );
        } else {
            guildConf.cases.push(modcase);
            this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        }
        return this.sendSuccess(msg.channel, `***Unbanned ${user.username}#${user.discriminator}***`);
    }
}

export default Unban;
