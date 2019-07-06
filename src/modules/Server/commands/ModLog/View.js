import { Command } from 'axoncore';

class View extends Command {
    constructor(module) {
        super(module);
        this.label = 'view';
        this.aliases = ['show'];
        this.isSubcmd = true;

        this.infos = {
            owners: ['Null'],
            description: 'Show information on the current modlogs',
            usage: 'show',
            name: 'modlogs show',
        };

        this.permissions.serverAdmin = true;
        this.permissions.bot = ['sendMessages'];
        this.options.guildOnly = true;
    }

    execute( { msg, guildConf } ) {
        const channelID = guildConf.modLogChannel || 'Not Set';
        const status = guildConf.modLogStatus ? 'enabled' : 'disabled';

        return this.sendMessage(msg.channel, {
            embed: {
                title: this.axon.LangClass.fetchSnippet('modlog_settings', { guildConf } ),
                fields: [
                    {
                        name: this.axon.LangClass.fetchSnippet('channel_id', { guildConf } ),
                        value: `\`${channelID}\``,
                        inline: true,
                    },
                    {
                        name: this.axon.LangClass.fetchSnippet('status', { guildConf } ),
                        value: status,
                        inline: true,
                    },
                ],
                color: this.axon.configs.template.embed.colors.help,
            },
        } );
    }
}

export default View;
