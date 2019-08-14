import { Command } from 'axoncore';

class ModCase extends Command {
    constructor(module) {
        super(module);
        this.label = 'case';

        this.infos = {
            owners: ['Null'],
            description: 'View a moderation case',
            usage: 'case [case id]',
            examples: ['case 69'],
        };

        this.permissions.serverMod = true;
        this.permissions.bot = ['sendMessages'];

        this.options.guildOnly = true;
        this.options.argsMin = 1;
    }

    async genEmbed(modcase, guild) {
        const type = modcase.type[0].toUpperCase() + modcase.type.slice(1);
        const user = await this.axon.client.getRESTUser(modcase.user);
        const mod = guild.members.get(modcase.mod);

        const good = ['unban', 'unmute'];
        const bad = [
            'ban',
            'kick',
            'massban',
            'mute',
            'ban match',
        ];
        const neutral = ['warn'];

        const colors = {
            good: this.axon.configs.template.logs.good,
            bad: this.axon.configs.template.logs.bad,
            neutral: this.axon.configs.template.logs.neutral,
        };
        let color;

        if (good.includes(modcase.type) ) color = colors.good;
        if (bad.includes(modcase.type) ) color = colors.bad;
        if (neutral.includes(modcase.type) ) color = colors.neutral;
        const embed = {
            title: `Moderation | ${type} | ID: ${modcase.id}`,
            fields: [
                {
                    name: 'User',
                    value: `${user.mention} (${user.username}#${user.discriminator})`,
                    inline: true,
                },
                {
                    name: 'Moderator',
                    value: `${mod.mention}`,
                    inline: true,
                },
                {
                    name: 'Reason',
                    value: modcase.reason,
                    inline: true,
                },
            ],
            footer: { text: `ID: ${user.id}` },
            color,
        };

        if (modcase.type === 'mute') {
            embed.fields.push( { name: 'Time', value: this.Utils.fullTimeFormat(modcase.mutedFor), inline: true } );
        }

        return embed;
    }

    static rebuildEmbed(message) {
        if (!message.embeds[0] ) return null;
        const mEmbed = message.embeds[0];
        if (!mEmbed.title.startsWith('Moderation |') ) return null;
        return {
            title: mEmbed.title,
            color: mEmbed.color,
            footer: mEmbed.footer,
            fields: mEmbed.fields,
        };
    }

    async execute( { msg, args, guildConf } ) {
        if (!guildConf.cases || guildConf.cases.length === 0) this.sendError(msg.channel, 'There are no cases for this server!');
        const mCase = guildConf.cases.find(modCase => modCase.id === args[0] );
        if (!mCase) return this.sendError(msg.channel, `No case found with id of ${args[0]}`);
        let embed;
        if (mCase.mID) {
            try {
                const message = await this.axon.client.getMessage(mCase.cID, mCase.mID);
                embed = this.rebuildEmbed(message);
            } catch (err) {
                embed = await this.genEmbed(mCase, msg.channel.guild);
            }
        } else {
            embed = await this.genEmbed(mCase, msg.channel.guild);
        }
        return this.sendMessage(msg.channel, { embed } );
    }
}

export default ModCase;
