import { Event } from 'axoncore';

class MuteJoin extends Event {
    constructor(...args) {
        super(...args);
        this.label = 'MuteJoin';
        this.eventName = 'guildMemberAdd';
        this.load = true;

        this.infos = {
            owners: ['Null'],
            description: 'Handles persistant mutes',
        };
    }

    async execute(args, guildConf) {
        const { member } = args;
        if (!guildConf.mutedRole || guildConf.cases.length === 0) return Promise.resolve();
        const mcase = guildConf.cases.find(cas => cas.user === member.id && cas.status === 'muted');
        if (!mcase) return Promise.resolve();
        return member.addRole(guildConf.mutedRole, `Mute persist. Case ${mcase.id}`);
    }
}

export default MuteJoin;
