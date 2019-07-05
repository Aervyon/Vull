import { Command } from 'axoncore';

class Lang extends Command {
    constructor(module) {
        super(module);
        this.label = 'lang';

        this.infos = {
            description: 'Pick a language for your guild',
            usage: 'lang (language code)',
            examples: ['lang fr', 'lang'],
        };

        this.permissions.bot = ['embedLinks'];
        this.permissions.serverAdmin = true;

        this.options.guildOnly = true;
    }

    execute( { msg, args, guildConf } ) {
        if (!args[0] ) {
            return this.sendMessage(msg.channel, {
                embed: {
                    title: 'Current language',
                    fields: [
                        {
                            name: this.axon.LangClass.fetchSnippet('lang_gl', { guildConf } ),
                            value: this.axon.LangClass.pickLang(guildConf.lang),
                            inline: true,
                        },
                        {
                            name: this.axon.LangClass.fetchSnippet('lang_bl', { guildConf } ),
                            value: this.axon.LangClass.default,
                            inline: true,
                        },
                    ],
                },
            } );
        }
        const lang = this.axon.LangClass.langs[args[0].toLowerCase()];
        if (!lang) return this.sendError(msg.channel, this.axon.LangClass.fetchSnippet('lang_err', { guildConf, custom: args[0].toLowerCase() } ),);
        guildConf.lang = args[0].toLowerCase();
        this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        return this.sendSuccess(msg.channel, this.axon.LangClass.fetchSnippet('lang_success', { guildConf, custom: args[0].toLowerCase() } ),);
    }
}

export default Lang;
