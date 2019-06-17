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

    async execute(member, guild, guildConf) {
        const gConf = !guild.id ? guildConf : guild;
        console.log(gConf);
        if (!gConf) {
            console.log('No guild config');
            throw Error('Excuse me what the fuck');
        }
        console.log('Got MuteJoin');
        console.log(!!gConf.cases);
        if (!gConf.mutedRole || !gConf.cases) return Promise.resolve();
        console.log('Checking for case');
        const mcase = gConf.cases.find(cas => cas.user === member.id && cas.status === 'muted');
        if (!mcase) return Promise.resolve();
        console.log('Case found');
        return member.addRole(gConf.mutedRole, `Mute persist. Case ${mcase.id}`);
    }
}

export default MuteJoin;
