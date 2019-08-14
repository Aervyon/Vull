/* eslint-disable no-magic-numbers */
import { Utils, AxonError } from 'axoncore';

/**
 * Custom Utils designed to help Vull.
 *
 * @class
 * @extends axoncore.Utils
 * */
class VullUtils extends Utils {
    /**
     * @prop hrReg Regex to resolve hours
     * @prop mReg Regex to resolve minutes
     * @prop dReg Regex to resolve days
     * @prop yReg Regex to resolve years
     * @prop wReg Regex to resolve weeks
     * @prop timeReg Regex used to slice useless portions of a time string off
     * */
    constructor(...args) {
        super(...args);
        this.hrReg = /(h|hour|hr|hours|hrs)$/;
        this.mReg = /(m|minute|min|mins|minutes)$/;
        this.dReg = /(d|days|ds|day)$/;
        this.yReg = /(y|year|yr|yrs|years)$/;
        this.wReg = /(w|week|weeks|ws)$/;
        this.timeReg = /, 0 [a-z]{5,}/ig;
    }

    /**
     * Checks if time is valid number
     *
     * @param {Number} ms The time in milliseconds.
     *
     * @private
     *
     * @memberof VullUtils
     * */
    _isValidVullNum(ms) {
        if (Math.sign(ms) < 1) return 'MS cannot be negative or 0';
        if (isNaN(ms) ) return 'MS must be Number';
        if (!isFinite(ms) ) return 'MS cannot be Infinity';
        return true;
    }

    /**
     *Turns milliseconds to a readable string.
     *
     * @param {Number} ms Milliseconds to turn to a string.
     *
     * @memberof VullUtils
     * @returns {String}
     * */
    fromMS(ms) {
        const isValid = this._isValidVullNum(ms);
        if (isValid !== true) throw Error(isValid);
        const moment = this.axon.deps.get('moment');
        return moment.duration(ms, 'ms').format('Y [year,] M [month,] W [week,] d [day,] h [hour,] m [minute,] s [second]');
    }

    /**
     * Slices time string to not contain garbage.
     *
     * @param {String} timeString The time as string to simplify
     * Time string must be a string like the output of VullUtils.fromMS
     *
     * @memberof VullUtils
     * @returns {String}
     * */
    sliceTime(timeString) {
        return timeString.replace(this.timeReg, '');
    }

    /**
     * Nicely formats millisecond time.
     *
     * @param {Number} ms Milliseconds to turn to a nice string
     *
     * @memberof VullUtils
     * @returns {String}
     * */
    fullTimeFormat(ms) {
        return this.sliceTime(this.fromMS(ms) );
    }

    /**
     * Inits the muted role for a guild.
     * Should only be used with mute command.
     *
     * @param {Object} guildConf The guilds database configuration.
     * @param {Object} guild The guild to make the muted role for
     *
     * @memberof VullUtils
     * @returns {String<Role.id>}
     * */
    async initMutedRole(guildConf, guild) {
        const role = await guild.createRole( { name: 'V-Muted', color: 6842472, permissions: 0 }, 'Automatic mute setup');
        guild.channels.forEach(channel => {
            if (channel.type !== 1 && channel.type !== 4) channel.editPermission(role.id, 0, 35657792, 'role', 'Automatic mute setup');
        } );
        guildConf.mutedRole = role.id;
        this.axon.updateGuildConf(guild.id, guildConf);
        return role.id;
    }

    /**
     * Turn a date string to milliseconds.
     * Useful for functions requiring user input that need millisecond time.
     *
     * @param {String} dateString The string to get the time from.
     *
     * @memberof VullUtils
     * @returns {Number}
     */
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
