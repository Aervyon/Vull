const Eris = require('eris')
const config = require('../config')
const colors = require('colors')

const prefix = ['@mention '] // Define prefix

if (!config) { // If no config
  console.log(colors.red('This is just great... There is no config file. Make one or get one!')) // Tell the user the bot needs a config
  process.exit() // End the process
}

if (!config.token) { // If no config token
  console.log(colors.red('I NEED A TOKEN!')) // Tell the user the bot needs a token
  process.exit() // End the process
}
if (!config.prefix) { // If no config prefix
  console.log(colors.yellow('You didnt set a prefix. I have set a prefix for you though, it\'s "vull "')) // Warn the user
  prefix.push('s!') // Push 's!'
} else { // If there is a prefix
  prefix.push(config.prefix) // Push the prefix to prefix
}
if (!config.owner) { // If no config owner
  console.log(colors.red('I need a owner NAME, ID, and Discriminator in the config file!')) // Tell the user
  process.exit() // End the process
} else if (config.owner && (!config.owner.id || !config.owner.name || !config.owner.discrim)) { // If there is a config owner, but no discrim, name, or id
  console.log(colors.red('I need a owner NAME, ID, and DISCRIM in the config file!')) // Tell the user
  process.exit() // End the process
}

const bot = new Eris.CommandClient(config.token, { restMode: true,
    defaultImageFormat: 'png',
    defaultImageSize: 512,
    guildCreateTimeout: 9000 }, { // Define the bot settings
  prefix, // Register the default prefix
  ignoreSelf: true, // Ignore itself
  ignoreBots: true, // Ignore all bots
  defaultCommandOptions: { // The options for all commands
    caseInsensitive: true, // Make all commands case insensitive
    guildOnly: true // make all commands guild only
  },
  defaultHelpCommand: false // Disable the default help command
})

module.exports = bot // Export the bot

console.log(colors.green(`config: \n    Owner: \n       Name: ${config.owner.name} \n       Discrim: ${config.owner.discrim} \n       ID: ${config.owner.id}\n  Status: ${config.status}\n  Prefixes: ${prefix.toString()}\n\n\n`).bold)
