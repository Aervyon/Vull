import { Command, Resolver } from 'axoncore';

class Quote extends Command {
    constructor(module) {
        super(module);
        this.label = 'quote';

        this.infos = {
            description: 'Quote a message',
            owners: ['Null'],
            usage: 'quote [messageID] [channel]',
            examples: ['quote 577706024459567125', 'quote 577706024459567125 Testing'],
        };
        this.argsMin = 1;
    }

    async execute( { msg, args } ) {
        let mess;
        let content;
        const embed = {};
        let channel;
        if (!args[1] ) {
            channel = msg.channel;
        }
        if (args[1] ) {
            channel = Resolver.channel(msg.channel.guild, args[1] );
            if (!channel) return this.sendError(msg.channel, 'Channel not found!');
        }
        mess = await this.axon.client.getMessage(channel.id, args[0] );
        if (!mess) return this.sendError(msg.channel, 'Message not found!');
        const messg = await this.sendMessage(msg.channel, `${this.axon.configs.template.emote.loading} Restrucuring message!`);
        if (mess.content) content = mess.content;
        if (!mess.embeds || mess.embeds.length === 0) {
            if (content) {
                this.editMessage(messg, `${this.axon.configs.template.emote.success} Restructuring Success`);
                return this.sendMessage(msg.channel, content);
            }
            return this.editMessage(messg, `${this.axon.configs.template.emote.error} Empty message`);
        }
        mess = mess.embeds[0];
        if (mess.author) embed.author = mess.author;
        if (mess.description) embed.description = mess.description;
        if (mess.title) embed.title = mess.title;
        if (mess.image) embed.image = mess.image;
        if (mess.thumbnail) embed.thumbnail = mess.thumbnail;
        if (mess.footer) embed.footer = mess.footer;
        if (mess.fields && mess.fields.length > 0) embed.fields = mess.fields;
        if (mess.color) embed.color = mess.color;

        if (!embed && !content) return this.editMessage(messg, `${this.axon.configs.template.emote.error} Restructuring failed: Empty Message`);

        await this.editMessage(messg, `${this.axon.configs.template.emote.success} Restructuring Success!`);
        const obj = {};
        if (content) obj.content = content;
        if (embed) obj.embed = embed;
        return this.sendMessage(msg.channel, obj);
    }
}

export default Quote;
