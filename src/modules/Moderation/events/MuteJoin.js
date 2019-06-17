import { Event } from 'axoncore';

class MuteJoin extends Event {
    constructor(...args) {
        super(...args);
        this.label = 'MuteJoin';
        this.eventName = 'guildMemberAdd';
        this.load = true;

        this.infos = {
            owners: ['Null'],
            description: 'Handles persistent mutes',
        };
    }

    async execute(member, guild, guildConf) {
        const gConf = !guild.id ? guild : guildConf;
        if (!gConf) {
            return;
        }
        if (!gConf.mutedRole || !gConf.cases) return Promise.resolve();
        const mcase = gConf.cases.find(cas => cas.user === member.id && cas.status === 'muted');
        if (!mcase) return Promise.resolve();
        return member.addRole(gConf.mutedRole, `Mute persist. Case ${mcase.id}`);
    }
}

export default MuteJoin;
