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

    async execute( { msg, args, guildConf } ) {
        let failsafe = true;
        if (['--no-failsafe', '-nfs'].includes(args[0].toLowerCase())) {
            failsafe = false;
            args.shift();
        }

        try {
            await msg.delete()
        } catch {
            if (msg.channel.messages.get(msg.id) && failsafe) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('del_msg_fail', { guildConf }) );
        }

        const total = args.join(' ');
        return this.sendMessage(msg.channel, total);
    }
}

export default Say;
