import { Command, Resolver } from 'axoncore';

class DM extends Command {
    constructor(module) {
        super(module);
        this.label = 'dm';

        this.infos = {
            owners: ['Null'],
            description: 'DM a user',
            usage: 'dm [user] [msg]',
            name: 'dm',
            examples: ['dm Null Don\'t do that.']
        };

        this.permissions.serverMod = true;
        this.options.argsMin = 2;
        this.guildOnly = true;
    }

    async execute( { msg, args } ) {
        
        const DMChannel = await this.axon.client.getDMChannel(msg.author.id)

        try {
            await msg.delete();
        } catch {
            if (msg.channel.messages.get(msg.id)) return this.sendError(DMChannel, 'Command Failed => Unable to delete message');
        }

        const user = Resolver.member(msg.channel.guild, args[0]);

        if (!user) {
            return this.sendError(msg.channel, 'Command Failed => User not found');
        }

        const userDM = await this.axon.client.getDMChannel(user.id);

        let message;

        let startingPart = `DM from ${msg.channel.guild.name}: `

        try {
            message = await this.sendMessage(userDM, `${startingPart}${args.slice(1).join(' ')}` );
        } catch {
            return this.sendError(DMChannel, 'Command Failed => Unable to DM user!');
        } finally {
            return this.sendMessage(DMChannel, {
                content: `${this.axon.configs.template.emote.success} Sent a DM to \`${user.user.username}#${user.user.discriminator} (${user.id})\`!`,
                embed: {
                    fields: [
                        {
                            name: 'DM Content',
                            value: message.cleanContent.slice(startingPart.length),
                        }
                    ],
                    color: this.axon.configs.template.embed.colors.help
                }
            })
        }
    }
}

export default DM;
