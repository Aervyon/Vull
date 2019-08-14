import { Command } from 'axoncore';

class Add extends Command {
    constructor(module) {
        super(module);
        this.label = 'add';
        this.aliases = ['get'];

        this.infos = {
            owners: ['Null'],
            description: 'Command to send a way to get the bot.',
        };

        this.enabled = true;
        this.serverBypass = true;
    }

    async execute( { msg } ) {
        const dmChan = await msg.author.getDMChannel();
        return this.sendMessage(dmChan, {
            embed: {
                title: 'Thanks for showing interest in Vull',
                url: 'https://github.com/VoidNulll/Vull',
                description: 'You can self host me by clicking on the title (No selfhost support) or by adding the [Public bot](https://discordapp.com/api/oauth2/authorize?client_id=471038759362887680&permissions=499444758&scope=bot) to your server (All permissions are required)!',
                fields: [
                    {
                        name: 'Do not trust the link?',
                        value: 'Github: https://github.com/VoidNulll/Vull\nPublic bot: https://discordapp.com/api/oauth2/authorize?client_id=471038759362887680&permissions=499444758&scope=bot',
                    },
                ],
                color: this.axon.configs.template.embed.colors.help,
            },
        } );
    }
}

export default Add;
