import { Event } from 'axoncore';

class MuteOverwrites extends Event {
    constructor(module) {
        super(module);
        this.label = 'MuteOverwrites';
        this.eventName = 'channelUpdate';

        this.load = true;

        this.infos = {
            owner: ['Null'],
            description: 'Failsafe to disallow changing mute role permissions',
        };
    }

    execute(channel, oldChannel, guildConf) {
        const overwrites = channel.permissionOverwrites.get(guildConf.mutedRole);
        if (!overwrites || overwrites.deny !== 35657792) {
            channel.editPermission(guildConf.mutedRole, 0, 35657792, 'role', 'Vull mute failsafe');
        }
        return Promise.resolve();
    }
}

export default MuteOverwrites;
