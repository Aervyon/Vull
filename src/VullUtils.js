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
     * @prop {Object} nums Permissions numbers, used for calculating permissions.
     * */
    constructor(...args) {
        super(...args);
        this.hrReg = /(h|hour|hr|hours|hrs)$/;
        this.mReg = /(m|minute|min|mins|minutes)$/;
        this.dReg = /(d|days|ds|day)$/;
        this.yReg = /(y|year|yr|yrs|years)$/;
        this.wReg = /(w|week|weeks|ws)$/;
        this.timeReg = /, 0 [a-z]{5,}/ig;
        this.nums = {
            createInstantInvite: 1,
            kickMembers: 2,
            banMembers: 4,
            administrator: 8,
            manageChannels: 16,
            manageGuild: 32,
            addReactions: 64,
            viewAuditLogs: 128,
            voicePrioritySpeaker: 256,
            readMessages: 1024,
            sendMessages: 2048,
            sendTTSMessages: 4096,
            manageMessages: 8192,
            embedLinks: 16384,
            attachFiles: 32768,
            readMessageHistory: 65536,
            mentionEveryone: 131072,
            externalEmojis: 262144,
            voiceConnect: 1048576,
            voiceSpeak: 2097152,
            voiceMuteMembers: 4194304,
            voiceDeafenMembers: 8388608,
            voiceMoveMembers: 16777216,
            voiceUseVAD: 33554432,
            changeNickname: 67108864,
            manageNicknames: 134217728,
            manageRoles: 268435456,
            manageWebhooks: 536870912,
            manageEmojis: 1073741824,
            all: 2146958847,
            allGuild: 2080374975,
            allText: 805829713,
            allVoice: 871366929,
        };
    }

    /**
     * Calculate permissions using a object of perms
     *
     * @param {Object} data The permissions to calculate for
     *
     *  @returns {Object} Object containing the perms denied & allowed
     */
    calculate(data) {
        let allow = 0;
        let deny = 0;
        for (const key of Object.keys(data) ) {
            if (!this.nums[key] ) throw new AxonError(`Key ${key} not found!`, 'Enums');
            if (data[key] === true) {
                allow = Math.round(allow + this.nums[key] );
            } else if (data[key] === false) {
                deny = Math.round(deny + this.nums[key] );
            }
            if (key === 'all') {
                if (data[key] === true) {
                    allow = this.nums[key];
                    break;
                } else if (data[key] === false) {
                    deny = this.nums[key];
                    break;
                }
            }
        }
        return { allow, deny };
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
    static _isValidVullNum(ms) {
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
