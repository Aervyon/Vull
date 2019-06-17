import { Command, Resolver } from 'axoncore';

import EventEmitter from 'eventemitter3';



class Mute extends Command {
    constructor(module) {
        super(module);
        this.label = 'mute';

        this.infos = {
            owners: ['Null'],
            description: 'Mute a user in the server',
            usage: 'mute [user] [time] (reason)',
            examples: ['mute Null 120m Timeout', 'mute Null 2h'],
        };

        this.permissions.serverMod = true;
        this.permissions.bot = [
            'manageRoles',
            'sendMessages',
            'manageMessages',
            'manageChannels',
        ];

        this.options.guildOnly = true;
        this.options.argsMin = 2;

        this.ee = new EventEmitter();

        this.ee.on('unmute', this.unmute.bind(this) );
    }

    async unmute(object) {
        // eslint-disable-next-line prefer-const
        let { modcase, guild } = object;
        await this.Utils.sleep(5000);
        guild = this.axon.client.guilds.get(guild.id);
        let guildConf = await this.axon.getGuildConf(guild.id);
        if (!guildConf) return;
        if (!guildConf.mutedRole) return;
        modcase = guildConf.cases.find(cas => cas.id === modcase.id);
        let curcase = guildConf.cases.find(cas => cas.user === modcase.user && cas.status === 'muted' && cas.id === modcase.id);
        if (!curcase) return;
        await this.axon.Utils.sleep(modcase.mutedFor - 5000);
        guildConf = await this.axon.getGuildConf(guild.id);
        curcase = guildConf.cases.find(cas => cas.user === modcase.user && cas.status === 'muted' && cas.id === modcase.id);
        if (guildConf.cases.indexOf(curcase) < 1) return;
        const index = guildConf.cases.indexOf(curcase);
        curcase.status = null;
        guildConf.cases.fill(curcase, index, index);
        const mem = guild.members.get(modcase.user);
        if (mem) {
            mem.removeRole(guildConf.mutedRole, `Unmute [AUTO]. Case ${modcase.id}`);
        }
        const nmodcase = {
            mod: this.bot.user.id, user: mem.id, reason: `Unmute [AUTO]. (${modcase.id})`, id: String(guildConf.cases.length + 1), type: 'unmute', unmutedAt: new Date(),
        };

        if (guildConf.modLogStatus) this.axon.client.emit('moderation', { modcase: nmodcase, guildConf } );
        else {
            guildConf.cases.push(nmodcase);
            this.axon.updateGuildConf(guild.id, guildConf);
        }
        return;
    }

    async execute( { msg, args, guildConf } ) {
        const week = 604800000;
        const min = 60000;
        const mem = Resolver.member(msg.channel.guild, args[0] );
        let time = args[1];
        if (!mem) return this.sendError(msg.channel, 'Member not found');
        if (this.axon.AxonUtils.isAdmin(mem) || this.axon.AxonUtils.isMod(mem, guildConf) ) {
            return this.sendError(msg.channel, 'That user is a mod/admin!');
        }
        if (mem.roles && guildConf.protectedRoles && guildConf.protectedRoles.length > 0) {
            for (const role of guildConf.protectedRoles) {
                const check = mem.roles.includes(role);
                if (check) return this.sendError(msg.channel, 'User is protected!');
            }
        }
        if (!args[1].match(this.axon.Utils.hrReg) && !args[1].match(this.axon.Utils.mReg) && !args[1].match(this.axon.Utils.dReg) ) {
            if (!isNaN(Number(args[1] ) ) ) {
                time = `${args[1]}m`;
            } else {
                return this.sendError(msg.channel, 'Invalid time. Must be hours, days, or minutes.');
            }
        }
        msg.delete();
        try {
            time = this.axon.Utils.toMS(time);
        } catch (err) {
            const er = err.message || err;
            const ers = [
                'MS cannot be Infinity',
                'MS must be Number',
                'MS cannot be negative or 0',
            ];
            if (er === 'Unsupported time format') return this.sendError(msg.channel, 'The time format you entered is incorrect');
            if (ers.includes(er) ) return this.sendError(msg.channel, er.replace('MS', 'Time') );
            return this.sendError(msg.channel, 'Something unknown happened while converting the time to a Vull readable state.');
        }
        if (time > week) return this.sendError(msg.channel, 'Mute time cannot be over a week');
        if (time < min) return this.sendError(msg.channel, 'Mute time cannot be under a minute');
        if (guildConf.cases.find(cas => cas.user === mem.id && cas.status === 'muted') ) {
            return this.sendError(msg.channel, 'User is muted!');
        }
        const reason = args.slice(2).join(' ') || 'No reason';
        let rID = guildConf.mutedRole;
        if (!guildConf.mutedRole) {
            rID = await this.axon.Utils.initMutedRole(guildConf, msg.channel.guild);
        }
        mem.addRole(rID, reason);
        const modcase = {
            mod: msg.member.id, user: mem.id, reason, id: String(guildConf.cases.length + 1), type: 'mute', mutedFor: time, mutedAt: new Date(), status: 'muted',
        };
        if (guildConf.modLogStatus) {
            this.axon.client.emit('moderation', { modcase, guildConf } );
        } else {
            guildConf.cases.push(modcase);
            this.axon.updateGuildConf(msg.channel.guild.id, guildConf);
        }
        this.ee.emit('unmute', { guild: msg.channel.guild, modcase } );
        return this.sendSuccess(msg.channel, `**Muted ${mem.user.username}#${mem.user.discriminator}!**`);
    }
}

export default Mute;
