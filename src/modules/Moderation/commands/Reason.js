import { Command } from 'axoncore';

class Reason extends Command {
    constructor(module) {
        super(module);
        this.label = 'reason';

        this.infos = {
            owners: ['Null'],
            description: 'Change modlog reason',
            usage: 'reason [mod log id] [new reason]',
            example: ['reason 1 Banned wrong person'],
        };

        this.permissions.serverMod = true;
        this.permissions.bot = ['sendMessages', 'manageMessages'];
        this.options.argsMin = 2;
        this.options.guildOnly = true;
    }

    async execute( { msg, args, guildConf } ) {
        msg.delete();

        const modcase = guildConf.cases.find(c => c.id === args[0] );
        const reason = args.slice(1).join(' ');
        if (!modcase) return this.sendError(msg.channel, 'Modcase not found!');
        if (modcase.mID && modcase.cID) {
            const message = await this.bot.getMessage(modcase.cID, modcase.mID);
            const fields = [];
            for (const field of message.embeds[0].fields) {
                if (field.name.toLowerCase() === 'reason') field.value = reason;
                fields.push(field);
            }
            message.edit( {
                embed: {
                    title: message.embeds[0].title,
                    fields,
                    color: message.embeds[0].color,
                    footer: message.embeds[0].footer,
                },
            } );
        }
        const index = guildConf.cases.indexOf(modcase);
        if (!(index >= 0) ) return this.sendError(msg.channel, 'Couldn\'t replace the reason in the database!');
        modcase.reason = reason;
        guildConf.cases.fill(modcase, index, index);
        this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        return this.sendSuccess(msg.channel, `***Updated reason on case ${modcase.id}!***`);
    }
}

export default Reason;
