import { Schema, model, Document, Model } from 'mongoose';

export interface Axon extends Document {
    id: string;
    prefix: string;

    createdAt: Date;
    updatedAt: Date;

    bannedGuilds: string[];
    bannedUsers: string[];
}

const axonSchema = new Schema( {
    /** Index */
    id: { type: String, required: true, index: true }, // ID
    prefix: { type: String, default: 'v!' },

    /**
     * General info
     */
    createdAt: { type: Date, default: Date.now }, // date of schema creation
    updatedAt: { type: Date, default: Date.now }, // data of last DB update

    /**
     * Global banned
     */
    bannedGuilds: { type: Array, default: [] }, // array of ids => cache into Set
    bannedUsers: { type: Array, default: [] }, // array of ids => cache into Set

    /**
     * \/ Customs \/
     */

}, {
    strict: false,
    minimize: false,
} );

const mod: Model<Axon> = model('Axon', axonSchema);

export default mod;
