// Require stuff
const colors = require('colors')
const config = require('../config')
const bot = require('./bot')
const moment = require('moment')
const fs = require('fs')
const path = require('path')

const Datastore = require('nedb')

let db = new Datastore({ filename: './db/servers',
  autoload: true })

// Setup some fs functions

function getFiles (directory) {
  let files = fs.readdirSync(directory).map(name => path.join(directory, name)).filter(isFile)
  for (let file in files) {
    files[file] = files[file].slice(directory.length + 1)
  }
  return files
}

function isFile (source) {
  return fs.lstatSync(source).isFile()
}

// Stuff for responders

let responders = []

let responderFiles = getFiles('responders')

for (let rFile of responderFiles) {
  let response = require('../responders/' + rFile)
  responders.push(response)
}

// Database stuff

/* eslint array-element-newline: off */

db.find({}, {}, (err, docs) => {
  if (err) console.log(err)
  else {
    for (let doc of docs) {
      if (doc.prefix !== config.prefix) bot.registerGuildPrefix(doc.ID, [doc.prefix, '@mention '])
    }
  }
})

// Set the max listeners for Eris command client

bot.setMaxListeners(50)

let startTime = new Date()

console.log(colors.cyan(`Loading commands. Time: ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}`).bold)

let prefix = []

if (!config.prefix) {
  prefix.push('s!')
} else {
  prefix.push(config.prefix)
}

prefix = prefix.toString()
let files = require('../files')

let commands = []
for (let file of files) { // loops through all the commands
  let command = require('../commands/' + file)(bot)
  bot.registerCommand(command.name, command.run)
  commands.push(command)
  console.log(colors.cyan(`loaded ${commands.length} out of ${files.length} commands`))
}

// Bot events

bot.on('error', (err) => {
  console.log(err.stack) // Log the error
})

bot.on('disconnect', () => {
  console.log('\nBot disconnected. Attempting to reconnect')
})

bot.on('shardDisconnect', (error, id) => {
  console.log(`\nShard: ${id} crashed. Error: ${error}`)
})

bot.on('shardResume', (id) => {
  console.log(`\nShard ${id} has resumed`)
})

// More loading stuff

let rn = new Date()
let cmdTime = Math.abs(startTime - rn)
console.log(colors.cyan(`Loaded all commands in: ${moment.duration(cmdTime, 'ms')}ms`).bold)

let begin = new Date()

console.log(colors.green(`\n\nConnecting to Discord... Time: ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}`))
bot.connect()

// Define farray

let farray = [
  'false',
  'no',
  'disabled',
  'off'
]

/* eslint consistent-return: off */
/* eslint max-statements: off */

// This is for the autoresponder

bot.on('messageCreate', (msg) => {
  if (msg.author.bot) return null
  for (let responder of responders) {
    if (!responder.wildcard || responder.wildcard === null || responder.wildcard === '') {
      if (msg.content.toLowerCase() === responder.trigger.toLowerCase()) {
        if (responder.response.includes('user.mention')) {
          let response = responder.response.replace('user.mention', msg.author.mention)
          bot.createMessage(msg.channel.id, response)
        } else if (responder.response.includes('user.name')) {
          let response = responder.response.replace('user.name', `${msg.author.username}#${msg.author.discriminator}`)
          bot.createMessage(msg.channel.id, response)
        } else {
          bot.createMessage(msg.channel.id, responder.response)
        }
      }
    } else if (responder.wildcard === true) {
      if (msg.content.toLowerCase().includes(responder.trigger)) {
        if (responder.response.includes('user.mention')) {
          let response = responder.response.replace('user.mention', msg.author.mention)
          bot.createMessage(msg.channel.id, response)
        } else if (responder.response.includes('user.name')) {
          let response = responder.response.replace('user.name', `${msg.author.username}#${msg.author.discriminator}`)
          bot.createMessage(msg.channel.id, response)
        } else {
          bot.createMessage(msg.channel.id, responder.response)
        }
      }
    }
  }
})

// To check for prompt

if (!farray.includes(config.prompt)) {
  const readline = require('readline')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\n\nWould you like to exit the process (exit), or set the status (status)? '
  })

  bot.on('ready', () => {
    if (config.status) {
      bot.editStatus(null, { name: `${config.status} | ${prefix}help` })
    } else if (!config.status) {
      bot.editStatus(null, { name: `${prefix}help` })
    }
    let now = new Date()
    now = Math.abs(begin - now)
    console.log(colors.green(`Connected, time it took: ${moment.duration(now)}ms`).bold)
    rl.prompt()
  })

  rl.on('line', (line) => {
    if (line === 'status') {
      rl.question('What would you like the status to be? ', (answer) => {
        bot.editStatus(null, {
          name: answer,
          type: 0
        })
      })
      rl.prompt()
    } else if (line === 'exit') {
      rl.question('Are you sure you want to exit? (y/yes) ', (answer) => {
        if (answer.match(/^y(es)?$/i)) process.exit()
        else rl.prompt()
      })
    }
  })
} else {
  bot.on('ready', () => {
    if (config.status) {
      bot.editStatus(null, { name: `${config.status} | ${prefix}help` })
    } else if (!config.status) {
      bot.editStatus(null, { name: `${prefix}help` })
    }
    let now = new Date()
    now = Math.abs(begin - now)
    console.log(colors.green(`Connected, time it took: ${moment.duration(now)}ms`).bold)
  })
}
