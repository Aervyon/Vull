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
        if (!guildConf || !guildConf.mutedRole) return Promise.resolve();
        const role = channel.guild.roles.get(guildConf.mutedRole);
        if (!role) return Promise.resolve();
        const memb = channel.guild.members.get(this.axon.client.user.id);
        if (!memb.permission.has('administraot' || 'manageGuild' || 'manageChannels') ) return Promise.resolve();
        const deny = 35657792;
        const overwrites = channel.permissionOverwrites.get(guildConf.mutedRole);
        if (!overwrites || overwrites.deny !== deny) {
            channel.editPermission(guildConf.mutedRole, 0, deny, 'role', 'Vull mute failsafe');
        }
        return Promise.resolve();
    }
}

export default MuteOverwrites;
