const Mongoose = require('mongoose');

const { Schema } = Mongoose;

/* eslint-disable */
const blacklist = new Schema({
    ID: { type: String, required: true },
    blacklisted: { type: Boolean, default: true },
    type: { type: 'String', default: 'Guild' }
})

module.exports = Mongoose.model('blacklist', blacklist)
