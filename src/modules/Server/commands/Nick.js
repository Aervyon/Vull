import { Command } from 'axoncore';

class Nick extends Command {
    constructor(module) {
        super(module);
        this.label = 'nick';

        this.infos = {
            owner: ['Null'],
            description: 'Change the bots nickname on your guild',
            usage: 'nick [New nickname]',
            examples: ['nick Totally not Vull'],
        };

        this.permissions.serverAdmin = true;
        this.permissions.staff.bypass = [...this.axon.staff.owners, ...this.axon.staff.admins];
        this.options.guildOnly = true;
    }

    async execute( { msg, args, guildConf } ) {
        const nick = !args[0] ? null : args.join(' ');

        let output = await this.axon.client.editNickname(msg.channel.guild.id, nick, this.axon.LangClass.fetchSnippet('nick_reason', { msg, guildConf } ) );

        if (output.nick === this.axon.client.user.username || !output.nick) output = this.axon.LangClass.fetchSnippet('nick_reset', { guildConf } );
        else output = this.axon.LangClass.fetchSnippet('nick_change', { guildConf, custom: output.nick } );

        return this.sendMessage(msg.channel, output);
    }
}

export default Nick;
