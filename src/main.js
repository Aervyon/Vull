import Bot from './Bot';
import conf from './configs/customConf.json';
import moment from 'moment';
import { existsSync } from 'fs';
import path from 'path';
const momentDuration = require('moment-duration-format');

let mongoURL = 'mongodb://localhost/';
let useAlphaDB;

if (existsSync(path.join(__dirname, './configs/mongoConf.json') ) ) {
    const mongoConf = require('./configs/mongoConf');
    mongoURL = mongoConf.url;
    if (mongoConf.useAlphaDB) useAlphaDB = true;
}

momentDuration(moment);

try {
    const mongoose = require('mongoose');
    mongoose.connect(`${mongoURL}${useAlphaDB ? 'Vull_Alpha' : 'Vull'}`, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoReconnect: true,
    } )
        .then( () => {
            Bot.Logger.notice('Connected to Vull Database.');
        } )
        .catch(err => {
            Bot.Logger.emerg(`Could NOT connect to Vull Database.\n${err.stack}`);
        } );
} catch (e) {
    Bot.Logger.emerg(`Could NOT connect to Vull Database.\n${e.stack}`);
}

Bot.client.on('messageCreate', async msg => {
    if (!msg.channel.guild) return;
    const Guild = Bot.schemas.get('guildSchema');
    const guildConf = await Guild.findOne( { guildID: msg.channel.guild.id } );
    if (!guildConf) return;
    if (!guildConf.apings || !guildConf.apings.status) return;
    if (msg.author.id !== '246917294461157376') return;
    if (!msg.embeds || msg.embeds.length === 0) return;
    if (!msg.embeds[0].description.startsWith('You feel adventurous') ) return;
    if (guildConf.apings.users && guildConf.apings.users.length > 0) {
        msg.channel.createMessage(`${guildConf.apings.users.join(', ')} Adventure!`);
    }
    await Bot.Utils.sleep(123000);
    if (guildConf.apings.cooldownUsers && guildConf.apings.cooldownUsers.length > 0) {
        msg.channel.createMessage(`${guildConf.apings.cooldownUsers.join(', ')} You may adventure again!`);
    }
} );

Bot.start();

Bot.Logger.notice('Vull Online');
