import { Command, Resolver } from 'axoncore';

class Show extends Command {
    constructor(module) {
        super(module);
        this.label = 'show';
        this.aliases = ['show'];

        this.infos = {
            owners: ['Null'],
            description: 'Show server settings for apings',
            name: 'apings settings show',
        };

        this.isSubcmd = true;
    }

    execute( { msg, guildConf } ) {
        if (!guildConf.apings) return this.sendError(msg.channel, 'This guild does not have apings set up. Try running the settings command!');
        const channel = Resolver.channel(msg.channel.guild, guildConf.apings.channel);

        return this.sendMessage(msg.channel, {
            embed: {
                title: `aPings settings for ${msg.channel.guild.name}`,
                description: `**Status:** \`\`${guildConf.apings.status ? 'enabled' : 'disabled'}\`\`\n**Channel:** ${channel ? channel.mention : null}`,
            },
        } );
    }
}

export default Show;
