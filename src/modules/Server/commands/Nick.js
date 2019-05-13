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
        this.permissions.staff.needed = this.axon.staff.admins;
        this.permissions.staff.owners = this.axon.staff.owners;
        this.options.guildOnly = true;
    }

    async execute( { msg, args } ) {
        const nick = !args[0] ? null : args.join(' ');

        let output = await this.axon.client.editNickname(msg.channel.guild.id, nick, `Updated by ${msg.member.user.username}#${msg.member.user.discriminator} (${msg.member.id})`);

        if (output.nick === this.axon.client.user.username || !output.nick) output = 'Reset my nickname!';
        else output = `My nickname was set to \`${output.nick}\``;

        return this.sendMessage(msg.channel, output);
    }
}

export default Nick;
