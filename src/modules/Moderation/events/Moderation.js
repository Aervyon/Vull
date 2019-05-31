/* eslint-disable consistent-return */
import { Event, Resolver } from 'axoncore';

class Moderation extends Event {
    constructor(...args) {
        super(...args);
        this.label = 'Moderation';
        this.eventName = 'moderation';
        this.load = true;

        this.infos = {
            owners: ['Null'],
            description: 'Event to handle moderation logging',
        };
    }

    async execute(obj) {
        const { modcase, guildConf } = obj;
        const upper = modcase.type[0].toUpperCase();
        const type = upper + modcase.type.slice(1);
        const guild = this.axon.client.guilds.get(guildConf.guildID);
        const user = await this.axon.client.getRESTUser(modcase.user);
        const channel = guild.channels.get(guildConf.modLogChannel);
        const mod = Resolver.member(guild, modcase.mod);

        const good = ['unban'];
        const bad = [
            'ban',
            'kick',
            'massban',
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

        this.axon.updateGuildConf(guildConf.guildID, guildConf);
        if (!channel) return;
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
        if (modcase.type === 'massban') {
            const eh = modcase.id.match('-') ? `IDs: ${modcase.id}` : `ID: ${modcase.id}`;
            embed.title = `Moderation | ${type} | ${eh}`;
            embed.fields.shift();
            embed.footer = null;
        }
        const message = await this.sendMessage(channel, {
            embed,
        } );
        if (modcase.type !== 'massban') {
            modcase.mID = message.id;
            modcase.cID = message.channel.id;
            guildConf.cases.push(modcase);
            this.axon.updateGuildConf(guildConf.guildID, guildConf);
        }
    }
}

export default Moderation;
