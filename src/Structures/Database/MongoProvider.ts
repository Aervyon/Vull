import {
    ADBProvider,
    AxonConfig,
    GuildConfig,
    updateDBVal,
    AxonClient,
} from 'AxonCore';
import GuildSchema, { Guild } from './Mongo_Models/GuildSchema';
import AxonSchema from './Mongo_Models/AxonSchema';

export class MongoProvider extends ADBProvider {
    constructor(axon: AxonClient) {
        super(axon, 2);
    }

    // **** INIT **** //

    async initAxon(): Promise<AxonConfig> {
        const data = await AxonSchema.findOneAndUpdate( {
            id: '1',
        },
        {
            id: '1',
            prefix: this.axon.settings.prefixes[0],
            updatedAt: new Date(),
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        } ).lean().exec();

        return new this.AxonConfig(this.axon, data);
    }

    async initGuild(gID: string): Promise<GuildConfig> {
        const data = await GuildSchema.findOneAndUpdate( {
            guildID: gID,
        },
        {
            guildID: gID,
            prefixes: this.axon.settings.prefixes,
            updatedAt: new Date(),
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        } ).lean().exec();

        return new this.GuildConfig(this.axon, data);
    }

    // **** FETCHERS **** //

    async fetchAxon(): Promise<AxonConfig | null> {
        const data = await AxonSchema.findOne( {
            id: '1',
        } ).lean().exec();
        return data && new this.AxonConfig(this.axon, data);
    }

    async fetchGuild(gID: string): Promise<GuildConfig | null> {
        const data = await GuildSchema.findOne( {
            guildID: gID,
        } ).lean().exec();
        return data && new this.GuildConfig(this.axon, data);
    }

    fetchGuildDocument(gID: string): Promise<Guild|null> {
        return GuildSchema.findOne( {
            guildID: gID,
        } ).exec();
    }

    // **** UPDATES **** //

    async updateAxon(key: string, value: updateDBVal): Promise<boolean> {
        const out = <{nModified: number; n: number; ok: number; } | null><unknown>(await AxonSchema.updateOne( {
            id: '1',
        },
        {
            $set: {
                [key]: value,
                updatedAt: new Date(),
            },
        } ).lean().exec() );
        return !!(out && out.nModified);
    }

    async updateGuild(key: string, gID: string, value: updateDBVal): Promise<boolean> {
        const out = <{nModified: number; n: number; ok: number; } | null><unknown>(await GuildSchema.updateOne( {
            guildID: gID,
        },
        {
            $set: {
                [key]: value,
                updatedAt: new Date(),
            },
        } ).lean().exec() );
        return !!(out && out.nModified);
    }

    async saveAxon(data: AxonConfig): Promise<AxonConfig|null> {
        data.updatedAt = new Date();

        const res = await AxonSchema.findOneAndUpdate( {
            id: '1',
        },
        data,
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        } ).lean().exec();

        return res && new this.AxonConfig(this.axon, res);
    }

    async saveGuild(gID: string, data: GuildConfig): Promise<GuildConfig|null> {
        data.updatedAt = new Date();

        const res = await GuildSchema.findOneAndUpdate( {
            guildID: gID,
        },
        data,
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        } ).lean().exec();

        return res && new this.GuildConfig(this.axon, res);
    }
}

console.log(`MongoProvider.ts - MongoProvider is instance of ADBProvider: ${MongoProvider.prototype instanceof ADBProvider}`);

export default MongoProvider;
