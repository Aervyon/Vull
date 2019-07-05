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
        this.permissions.bot = ['manageMessages'];
        this.options.argsMin = 2;
        this.guildOnly = true;
    }

    async execute( { msg, args, guildConf } ) {

        const DMChannel = await this.axon.client.getDMChannel(msg.author.id);

        try {
            await msg.delete();
        } catch {
            if (msg.channel.messages.get(msg.id)) return this.sendError(DMChannel, this.axon.LangClass.fetchSnippet('dm_del_fail', { guildConf } ) );
        }

        const user = Resolver.member(msg.channel.guild, args[0]);

        if (!user) {
            return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('user_notfound') );
        }

        const userDM = await this.axon.client.getDMChannel(user.id);

        let message;

        let startingPart = this.axon.LangClass.fetchSnippet('dm_start', { guildConf, guild: msg.channel.guild } );

        try {
            message = await this.sendMessage(userDM, `${startingPart}${args.slice(1).join(' ')}` );
        } catch {
            return this.sendError(DMChannel, this.axon.LangClass.fetchSnippet('dm_msg_fail', { guildConf }) );
        }
        return this.sendMessage(DMChannel, {
            content: this.axon.LangClass.fetchSnippet('dm_success', { guildConf, custom: this.template.emote.success, guild: msg.channel.guild } ),
            embed: {
                fields: [
                    {
                        name: this.axon.LangClass.fetchSnippet('dm_field_cont'),
                        value: message.cleanContent.slice(startingPart.length),
                    }
                ],
                color: this.axon.configs.template.embed.colors.help
            }
        })
    }
}

export default DM;
