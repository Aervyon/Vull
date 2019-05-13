import { Command } from 'axoncore';

import Channel from './Channel';

class Say extends Command {
    constructor(module) {
        super(module);
        this.label = 'say';
        this.aliases = ['speak'];

        this.infos = {
            owners: ['Null'],
            description: 'Make the bot say something',
            usage: 'say [text]',
            examples: ['say I would prefer if you do not.'],
        };

        this.hasSubcmd = true;
        this.subcmds = [Channel];

        this.permissions.serverMod = true;
        this.options.argsMin = 1;
        this.guildOnly = true;
    }

    async execute( { msg, args } ) {

        try {
            await msg.delete()
        } catch {
            if (msg.channel.messages.get(msg.id) ) return this.sendError(msg.channel, 'Command failed => Couldn\'t delete the message!');
        }

        const total = args.join(' ');
        return this.sendMessage(msg.channel, total);
    }
}

export default Say;
