const config = require('../config') // Require the config file

module.exports = bot => ({ // The command
  name: 'stop', // The name of the command
  run: (msg) => { // What to run
    if (msg.author.id !== config.owner.id) return null // Stop the command
    bot.createMessage(msg.channel.id, 'Shutting down... Goodbye!').then(() => { // Create a message
      process.exit() // End the process
    }).catch(() => { // Catch the createMesage error
      process.exit() // End the process
    })
  },
  help: {
    type: 'owner',
    desc: 'Stops the bot',
    fullDesc: 'Stops the bot. The bot must be running on normal npm/node process.'
  }
})
