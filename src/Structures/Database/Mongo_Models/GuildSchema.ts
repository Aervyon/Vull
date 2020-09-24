import { Schema, model, Model, Document } from 'mongoose';

export interface Guild extends Document {
    guildID: string;
    prefixes: string[];

    modules: string[];
    commands: string[];
    eventListeners: string[];

    createdAt: Date;
    updatedAt: Date;

    ignoredUsers: string[];
    ignoredRoles: string[];

    modonly: boolean;
    modRoles: string[];
    modUsers: string[];

    antiraid: {
        enabled: boolean;
        time: number;
        accounts: number;
        accountAge: number;
        autolock: boolean;
        autoverify: boolean;
    }

    modlogs: {
        channel: string;
        enabled: boolean;
    }
}

const guild = new Schema( {
    guildID: { type: String, required: true, index: true },
    prefixes: { type: Array, required: true },

    modules: { type: Array, default: [] },
    commands: { type: Array, default: [] },
    eventListeners: { type: Array, default: [] },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    ignoredUsers: { type: Array, default: [] },
    ignoredRoles: { type: Array, default: [] },
    ignoredChannels: { type: Array, default: [] },

    modOnly: { type: Boolean, default: false },
    modRoles: { type: Array, default: [] },
    modUsers: { type: Array, default: [] },

    antiraid: {
        type: {
            enabled: Boolean,
            time: Number,
            accounts: Number,
            autolock: Boolean,
            accountAge: Number,
            autoverify: Boolean,
        },
        default: {
            enabled: false,
            time: 60000,
            accounts: 10,
            autolock: false,
            accountAge: 1,
        },
    },

    modlogs: {
        type: {
            channel: String,
            enabled: Boolean,
        },
        default: {
            enabled: false,
        },
    },

    mutedUsers: { type: Array, default: [] },
}, {
    autoIndex: true,
    minimize: false,
} );

const mod: Model<Guild> = model('Guild', guild);

export default mod;
