/* eslint-disable no-magic-numbers */
import { Utils } from 'axoncore';

class VullUtils extends Utils {
    constructor(...args) {
        super(...args);
        this.hrReg = /(h|hour|hr|hours|hrs)$/;
        this.mReg = /(m|minute|min|mins|minutes)$/;
        this.dReg = /(d|days|ds|day)$/;
        this.yReg = /(y|year|yr|yrs|years)$/;
        this.wReg = /(w|week|weeks|ws)$/;
        this.timeReg = /, 0 [a-z]{5,}/ig;
    }

    _isValidVullNum(ms) {
        if (Math.sign(ms) < 1) return 'MS cannot be negative or 0';
        if (isNaN(ms) ) return 'MS must be Number';
        if (!isFinite(ms) ) return 'MS cannot be Infinity';
        return true;
    }

    fromMS(ms) {
        const isValid = this._isValidVullNum(ms);
        if (isValid !== true) throw Error(isValid);
        const moment = this.axon.deps.get('moment');
        const date = moment.duration(ms, 'ms').format('Y [year,] M [month,] W [week,] d [day,] h [hour,] m [minute,] s [second]');
        return date;
    }

    sliceTime(timeString) {
        const time = timeString.replace(this.timeReg, '');
        return time;
    }

    fullTimeFormat(ms) {
        return this.sliceTime(this.fromMS(ms) );
    }

    async initMutedRole(guildConf, guild) {
        const role = await guild.createRole( { name: 'V-Muted', color: 6842472, permissions: 0 }, 'Automatic mute setup');
        guild.channels.forEach(channel => {
            if (channel.type !== 1 && channel.type !== 4) channel.editPermission(role.id, 0, 35657792, 'role', 'Automatic mute setup');
        } );
        guildConf.mutedRole = role.id;
        this.axon.updateGuildConf(guild.id, guildConf);
        return role.id;
    }

    toMS(dateString) {
        let time;
        if (dateString.match(this.hrReg) ) {
            dateString = dateString.replace(this.hrReg, '');
            time = Math.floor(Number(dateString) * 3600000);
        } else if (dateString.match(this.mReg) ) {
            dateString = dateString.replace(this.mReg, '');
            time = Math.floor(Number(dateString) * 60000);
        } else if (dateString.match(this.dReg) ) {
            dateString = dateString.replace(this.dReg, '');
            time = Math.floor(Number(dateString) * 86400000);
        } else if (dateString.match(this.wReg) ) {
            dateString = dateString.replace(this.wReg, '');
            time = Math.floor(Number(dateString) * 604800000);
        } else if (dateString.match(this.yReg) ) {
            dateString = dateString.replace(this.yReg, '');
            time = Math.floor(Number(dateString) * 31536000000);
        } else {
            throw Error('Unsupported time format');
        }
        const isValid = this._isValidVullNum(time);
        if (isValid !== true) throw Error(isValid);
        return time;
    }
}

export default VullUtils;
