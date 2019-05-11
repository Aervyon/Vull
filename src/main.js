/* eslint-disable no-ternary */
/* eslint-disable prefer-arrow-callback */
// Require stuff
const config = require('../config')
const bot = require('./bot')
const moment = require('moment')
const mongoose = require('mongoose')
const Guild = require('./models/guild')
const fs = require('fs')
const Blacklist = require('./models/blacklist');
const EventEmitter = require('events');
const events = new EventEmitter();
const { promisify } = require('util');
const sleep = promisify(setTimeout)

let mongoURL = 'mongodb://localhost/Vull'

if (config.mongoURL) {
    mongoURL = 'mongodb://' + config.mongoURL
}

let dbReady;
let ready;
let prefix = config.prefix || 'vull '

mongoose.connect(mongoURL, { useNewUrlParser: true, useFindAndModify: false });

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to Vull database!');
  dbReady = true
});

// eslint-disable-next-line max-statements
async function initGuild (guild) {
  if (guild.unavaliable) {
    console.log(`Cannot initate guild "${guild.name}", Guild unavaliable`)
    return;
  }
  const blacklist = await Blacklist.findOne({ ID: guild.id, blacklisted: true, type: 'Guild' }).exec();
  if (blacklist) {
    bot.leaveGuild(guild.id)
    console.log(`I was in a blacklisted guild. Left that. Guild ID: ${guild.id}`);
    return;
  }
  console.log(`Initating guild for ${guild.name}`)
  const fGuild = await Guild.findOne({ ID: guild.id }).exec();
  if (!fGuild) {
    console.log(`Guild "${guild.name}" not found. Ill try to create it in the DB!`)
    let eGuild = new Guild({ ID: guild.id });
    eGuild.save();
    if (!eGuild) {
      console.log(`Error - Guild creation - Guild ID: ${guild.id}`)
    }
    return null;
  }
  let gPrefix = [
    fGuild.prefix,
    '@mention '
  ]
  bot.registerGuildPrefix(guild.id, gPrefix);
  console.log(`Initated guild for ${guild.name}`)
}

(function checkforReady () {
  if (!ready || !dbReady) {
    setTimeout(checkforReady, 1000)
  } else {
    bot.guilds.forEach((guild) => {
      initGuild(guild)
    });
  }
}())

db.on('error', () => {
  console.error.bind(console, 'Mongoose connection error:');
  console.log('Shutting down...');
  process.exit();
})

bot.on('guildCreate', async (guild) => {
  if (guild.unavaliable) {
    return;
  }
  const fGuild = await Guild.findOne({ ID: guild.id }).exec()
  const blacklist = await Blacklist.findOne({ ID: guild.id, blacklisted: true, type: 'Guild' }).exec();
  if (blacklist) {
    bot.leaveGuild(guild.id)
    console.log(`Blacklisted guild tried adding me! Left. Guild ID: ${guild.id}`);
    return;
  }
  if (fGuild) {
    return;
  }
  console.log('Guild created (for bot)! Generating prefix');
  initGuild(guild);
})

// Database stuff

// Set the max listeners for Eris command client

// eslint-disable-next-line max-statements
function initCommand (command) {
  if (bot.commands[command.name]) {
      throw Error(`InitCommands - Command ${command.name} has already been registered!`);
  }
  if (!command.options) {
    command.options = { description: 'Description not found' }
    console.log(`WARN - Vull - Command ${command.name} has no description. If you are the developer/creator of this command, please add the commands option! - WARN`)
  }
  bot.registerCommand(command.name, command.run, command.options);
  const cmd = bot.commands[command.name];
  if (!command.options.subcommands) {
      command.options.subcommands = [];
  }
  cmd.options = command.options;
  console.log(`Vull - Loaded command ${command.name}!`);
}

function initCommands () {
  let time = new Date();
  console.log('Vull - Initating commands!');
  const cmds = './src/commands';
  const commands = fs.readdirSync(cmds);
  console.log(`0 out of ${commands.length} commands loaded!`);
  let i = 0;
  for (let command of commands) {
      command = require(`./commands/${command}`)(bot);
      initCommand(command);
      i++;
      console.log(`${i} out of ${commands.length} commands loaded`)
  }
  console.log('Vull - Initated commands!');
  console.log(`Vull - Initation time: ${new Date() - time}ms`)
}

// Apings handler. Also handles DMs

events.on('cooldown', async (channel, users) => {

    await sleep(125000);

    return channel.createMessage(`${users.join(', ')} Your wait is over! You may play adventure again!`);
})

let apingsReady = true;

bot.on('messageCreate', async (msg) => {
    if (!apingsReady) return;
    if (msg.author.id === bot.user.id) return;
    if (msg.channel.type === 1) {
        console.log(`Recieved DM from ${msg.author.username}#${msg.author.discriminator}. Content:\n${msg.cleanContent}`);
        return;
    }
    if (!msg.channel.guild) return;
    if (msg.channel.guild.unavaliable) return;
    if (msg.author.id === '246917294461157376' && (msg.embeds && msg.embeds[0] && msg.embeds[0].description && msg.embeds[0].description.startsWith('You feel adventurous'))) {
        const guild = await Guild.findOne({ ID: msg.channel.guild.id }).exec();
        if (!guild) {
            initGuild(msg.channel.guild)
        }
        if (guild.adventure.status !== 'enabled') {
            return;
        }
        if (msg.channel.id !== guild.adventure.channel) {
            return;
        }
        events.emit('cooldown', msg.channel, guild.adventure.cooldownUsers);
        if (!guild.adventure.users) {
            return;
        }
        return msg.channel.createMessage(`${guild.adventure.users.join(', ')} Adventure!`)
    }
})

// Bot events

bot.on('error', (err) => {
  console.log(err.stack) // Log the error
})

// eslint-disable-next-line multiline-ternary
let statu = config.status ? `${prefix}help | ${config.status}` : `${prefix}help`

bot.on('disconnect', () => {
    apingsReady = false;
})

bot.on('ready', () => {
  console.log('Vull - READY!')
  apingsReady = true;
  if (!ready) {
    initCommands()
  }
  ready = true;
  bot.editStatus(null, {
    name: statu
  })
})

// More loading stuff

console.log(`\n\nConnecting to Discord... Time: ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}`)
bot.connect()

/**
 * @param {string} [stat] The name of the game
 */

function randstatus (stat) {
  const randarr = [
    'online',
    'dnd',
    'idle'
  ]
  // eslint-disable-next-line multiline-ternary
  let status = config.status ? `${prefix}help | ${config.status}` : `${prefix}help`
  let rand = Math.round(Math.random() * randarr.length)
  let random = randarr[rand]
  bot.editStatus(random, {
    name: status
  })
}

setInterval(randstatus, 3600000)
