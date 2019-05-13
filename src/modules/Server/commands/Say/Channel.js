import { Command, Resolver } from 'axoncore';

class Channel extends Command {
    constructor(module) {
        super(module);
        this.label = 'channel';

        this.infos = {
            name: 'say channel',
            owners: ['Null'],
            description: 'Make the bot say something in a channel',
            usage: 'say channel [channel] [message]',
            example: 'say #general Hi',
        };

        this.isSubcmd = true;

        this.permissions.serverMod = true;
        this.options.argsMin = 2;
        this.guildOnly = true;
    }

    async execute( { msg, args } ) {
        if (!args[0]) {
            return this.sendHelp(msg);
        }
        const channel = Resolver.channel(msg.channel.guild, args[0] );

        try {
            await msg.delete()
        } catch {
            if (msg.channel.messages.get(msg.id) ) return this.sendError(msg.channel, 'Command failed => Couldn\'t delete the message!');
        }

        if (!channel) {
            return this.sendError(msg.channel, 'Command failed => Channel not found!');
        }

        const total = args.slice(1).join(' ');

        return this.sendMessage(channel, total);
    }
}

export default Channel;
