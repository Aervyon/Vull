/* eslint-disable consistent-this */


import { AxonClient, Resolver } from 'axoncore';

import * as modules from './modules/index';

import moment from 'moment';

import EventEmitter from 'eventemitter3';

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
        this.ee = new EventEmitter();
    }

    static get Resolver() {
        return Resolver;
    }

    async onUnmute(obj) {
        // eslint-disable-next-line prefer-const
        let { mID, gID, cas } = obj;
        const guild = this.client.guilds.get(gID);
        const mem = guild.members.get(mID);
        await this.Utils.sleep(cas.mutedFor - (new Date - cas.mutedAt) );
        const dbGuild = await this.getGuildConf(gID);
        const cas2 = dbGuild.cases.find(cass => cass.id === cas.id && cass.status === 'muted');
        if (!dbGuild.cases.find(cass => cass.id === cas.id && cass.status === 'muted') ) return;
        if (mem) {
            mem.removeRole(dbGuild.mutedRole, `Unmute [AUTO]. Case ${cas.id}`);
        }

        const index = dbGuild.cases.indexOf(cas2);
        cas2.status = null;
        dbGuild.cases.fill(cas2, index, index);

        const modcase = {
            mod: this.client.user.id, user: mem.id, reason: `Unmute [AUTO]. (${cas.id})`, id: String(dbGuild.cases.length + 1), type: 'unmute', unmutedAt: new Date(),
        };

        if (dbGuild.modLogStatus) this.client.emit('moderation', { modcase, guildConf: dbGuild } );
        else {
            dbGuild.cases.push(modcase);
            this.updateGuildConf(guild.id, dbGuild);
        }
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
            const { client } = this;
            const axon = this;
            cases.forEach(async cas => {
                const mem = guild.members.get(cas.user);
                const index = dbGuild.cases.indexOf(cas);
                cas.status = null;
                dbGuild.cases.fill(cas, index, index);
                if (new Date - cas.mutedAt >= cas.mutedFor) {
                    if (mem)
                        mem.removeRole(dbGuild.mutedRole, `Unmute [AUTO]. Case ${cas.id}`);

                    const modcase = {
                        mod: client.user.id, user: mem.id, reason: `Unmute [AUTO]. (${cas.id})`, id: String(dbGuild.cases.length + 1), type: 'unmute', unmutedAt: new Date(),
                    };

                    if (dbGuild.modLogStatus) client.emit('moderation', { modcase, guildConf: dbGuild } );
                    else {
                        dbGuild.cases.push(modcase);
                        axon.updateGuildConf(guild.id, dbGuild);
                    }
                } else {
                    axon.ee.emit('unmute', { cas, dbGuild, gID: guild.id, mID: mem.id } );
                }
            } );
        }
        return Promise.resolve();
    }

    async init() {
        this.deps.set('moment', moment);
        this.client.once('ready', this.onReady.bind(this) );
        this.ee.on('unmute', this.onUnmute.bind(this) );
        return Promise.resolve();
    }
}

export default VullClient;
