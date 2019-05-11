/* eslint-disable array-element-newline */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const config = require('../../config');
const prefix = config.prefix || 'vull ';

const guildModel = new Schema({
    ID: { type: String,
        required: true },
    prefix: { type: String,
        default: prefix },
    adventure: { type: Object,
        default: { status: 'disabled', channel: null, users: [], cooldownUsers: [] }
    }
})

module.exports = mongoose.model('guild', guildModel)
