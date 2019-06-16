/* eslint-disable consistent-this */


import { AxonClient, Resolver } from 'axoncore';

import * as modules from './modules/index';

import moment from 'moment';

/**
 * Custom client constructor
 *
 * @author KhaaZ
 *
 * @class Client
 * @extends {AxonCore.AxonClient}
 */
class VullClient extends AxonClient {
    constructor(client, axonOptions) {
        super(client, axonOptions, modules);
        this.deps = new Map();
    }

    get Resolver() {
        return Resolver;
    }

    initStaff() {
        // Called after initOwners has run
        // setup bot staff as per your convenience. Can be anything
        this.staff.contributors = [];
    }

    async onReady() {
        const Guild = this.schemas.get('guildSchema');
        let guilds = await Guild.find();
        guilds = guilds.filter(g => g.cases.find(cas => cas.status === 'muted') );
        if (guilds.length === 0) return Promise.resolve();
        for (const dbGuild of guilds) {
            if (!dbGuild) throw Error('No guild');
            const guild = this.client.guilds.get(dbGuild.guildID);
            if (!guild) return Promise.resolve();
            const cases = dbGuild.cases.filter(cas => cas.status === 'muted');
            const { client, Utils } = this;
            const axon = this;
            cases.forEach(async cas => {
                const mem = guild.members.get(cas.user);
                const index = dbGuild.cases.indexOf(cas);
                cas.status = null;
                dbGuild.cases.fill(cas, index, index);
                if (new Date - cas.mutedAt >= cas.mutedFor) {
                    mem.removeRole(dbGuild.mutedRole, `Unmute [AUTO]. Case ${cas.id}`);
                } else {
                    await Utils.sleep(cas.mutedFor - (new Date - cas.mutedAt) );
                    mem.removeRole(dbGuild.mutedRole, `Unmute [AUTO]. Case ${cas.id}`);
                }
                const modcase = {
                    mod: client.user.id, user: mem.id, reason: `Unmute [AUTO]. (${cas.id})`, id: String(dbGuild.cases.length + 1), type: 'unmute', unmutedAt: new Date(),
                };

                if (dbGuild.modLogStatus) this.client.emit('moderation', { modcase, guildConf: dbGuild } );
                else {
                    dbGuild.cases.push(modcase);
                    axon.updateGuildConf(guild.id, dbGuild);
                }
            } );
        }
        return Promise.resolve();
    }

    async init() {
        this.deps.set('moment', moment);
        this.client.once('ready', this.onReady.bind(this) );
        return Promise.resolve();
    }

    initStatus() {
        // called after ready event
        // overrides default editStatus
        // used to setup custom status
        this.client.editStatus(null, {
            name: `Vull | ${this.params.prefix[0]}help`,
            type: 0,
        } );
    }

    $sendFullHelp(msg) {
        // override sendFullHelp method
        return this.AxonUtils.sendMessage(msg.channel, 'Full Help override');
    }

    $sendHelp(command, msg) {
        // override sendHelp method
        return this.AxonUtils.sendMessage(msg.channel, `Help override for ${command.label}`);
    }
}

export default VullClient;
