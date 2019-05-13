import { Command } from 'axoncore';
import moment from 'moment';

class Info extends Command {
    constructor(module) {
        super(module);
        this.label = 'info';

        this.infos = {
            owner: ['Null'],
            description: 'Give some bot information',
        };

        this.enabled = true;
        this.serverBypass = true;
    }

    async execute( { msg, guildConf } ) {

        let maker;

        try {
            maker = await this.axon.client.getRESTUser('323673862971588609');

            maker = `${maker.username}#${maker.discriminator}`;
        } catch {
            maker = 'Null#0515';
        }

        this.sendMessage(msg.channel, {
            embed: {
                title: 'Info',
                description: `Vull V2 made by ${maker}`,
                fields: [
                    {
                        name: 'Node Version',
                        value: process.version,
                        inline: true,
                    }, {
                        name: 'Guild prefix',
                        value: `\`\`${guildConf.prefix[0] || this.axon.params.prefix[0]}\`\``,
                        inline: true,
                    }, {
                        name: 'Library',
                        value: 'Eris | AxonCore',
                        inline: true,
                    }, {
                        name: 'Version',
                        value: 'V1.5 - V2 (The AxonCore rewrite)',
                        inline: true,
                    }, {
                        name: 'Uptime',
                        value: moment.duration(this.axon.client.uptime).format('MMMM [Months,] WW [Weeks,] DD [Days,] h [Hours,] m [Minutes,] s [Seconds]'),
                        inline: true,
                    }, {
                        name: 'Language',
                        value: 'JavaScript',
                        inline: true,
                    }, {
                        name: 'Serving',
                        value: `${this.axon.client.guilds.size} Servers`,
                        inline: true,
                    }
                ],
                color: this.axon.configs.template.embed.colors.help,
                thumbnail: {
                    url: this.axon.client.user.avatarURL,
                },
            },
        } );
    }
}

export default Info;
