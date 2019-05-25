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
        this.options.argsMin = 1;
        this.options.guildOnly = true;
    }

    async fetchMessage(msg, channel, mID) {
        let mess;
        try { // Fetch the message
            mess = await this.axon.client.getMessage(channel.id, mID);
        } catch (err) {
            const er = err.message || err;
            if (er.search(/(\[10008]: Unknown Message)$/) ) { // If there is no message
                this.sendError(msg.channel, 'Message not found!');
                return 'fail';
            }
            if (er.search(/(Missing Access)$/) ) { // If the bot does not have access to see that channe;
                this.sendError(msg.channel, 'No permissions!');
                return 'fail';
            }
            if (er.search(/invalid form body/i) && er.match(/(is not snowflake.)$/) ) { // If what the user sent is not a ID
                this.sendError(msg.channel, 'Invalid ID. ID must be snowflake!');
                return 'fail';
            }
            // Uh, idk what other errors to handle here.
            this.sendError(msg.channel, 'Something went wrong and i have not a clue why or what.');
            return 'fail';
        }
        return mess;
    }

    async execute( { msg, args } ) {
        let mess;
        let content;
        const embed = {};
        let { channel } = msg;
        if (args[1] ) {
            channel = Resolver.channel(msg.channel.guild, args[1] );
            if (!channel) return this.sendError(msg.channel, 'Channel not found!');
        }
        mess = await this.fetchMessage(msg, channel, args[0] ); // Fetch a message and handle errors
        if (mess === 'fail') return Promise.resolve();
        if (!mess) return this.sendError(msg.channel, 'Message not found!'); // This should never happen but eh
        const messg = await this.sendMessage(msg.channel, `${this.axon.configs.template.emote.loading} Restrucuring message!`); // Alert that the message is being restrcutured
        // Restructure
        if (mess.content) {
            let ncontent = mess.content;
            if (mess.content.search(/<@!?\d+>/) ) {
                ncontent = mess.content.replace(/<@!?|>/g, '');
            }
            content = ncontent;
        }
        const fmess = mess;
        if (!mess.embeds || mess.embeds.length === 0) {
            if (content) {
                await this.editMessage(messg, {
                    content: `${this.axon.configs.template.emote.success} Restructuring Success!`,
                    embed: {
                        title: `Message: ${fmess.id}`,
                        author: {
                            icon_url: fmess.author.avatarURL,
                            name: fmess.author.username,
                        },
                        fields: [
                            {
                                name: 'Channel ID',
                                value: channel.id,
                                inline: true,
                            },
                            {
                                name: 'Message Link',
                                value: `https://discordapp.com/channels/${msg.channel.guild.id}/${channel.id}/${fmess.id}`,
                                inline: true,
                            },
                        ],
                        color: this.axon.configs.template.embed.colors.help,
                    },
                } );
                return this.sendMessage(msg.channel, content);
            }
            return this.editMessage(messg, `${this.axon.configs.template.emote.error} Empty message`);
        }
        mess = mess.embeds[0];
        if (mess.author) embed.author = mess.author;
        if (mess.description) embed.description = mess.description;
        if (mess.title) embed.title = mess.title;
        if (mess.url) embed.url = mess.url;
        if (mess.image) embed.image = mess.image;
        if (mess.thumbnail) embed.thumbnail = mess.thumbnail;
        if (mess.footer) embed.footer = mess.footer;
        if (mess.fields && mess.fields.length > 0) embed.fields = mess.fields;
        if (mess.color) embed.color = mess.color;

        if (!embed && !content) return this.editMessage(messg, `${this.axon.configs.template.emote.error} Restructuring failed: Empty Message`);

        await this.editMessage(messg, {
            content: `${this.axon.configs.template.emote.success} Restructuring Success!`,
            embed: {
                title: `Message: ${fmess.id}`,
                author: {
                    icon_url: fmess.author.avatarURL,
                    name: fmess.author.username,
                },
                fields: [
                    {
                        name: 'Channel ID',
                        value: channel.id,
                        inline: true,
                    },
                    {
                        name: 'Message Link',
                        value: `https://discordapp.com/channels/${msg.channel.guild.id}/${channel.id}/${fmess.id}`,
                        inline: true,
                    },
                ],
                color: this.axon.configs.template.embed.colors.help,
            },
        } );
        const obj = {};
        if (content) obj.content = content;
        if (embed) obj.embed = embed;
        return this.sendMessage(msg.channel, obj);
    }
}

export default Quote;
