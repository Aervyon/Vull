const randomColor = require('randomcolor')
const config = require('../config')
const moment = require('moment')

module.exports = bot => ({
  name: 'bot',
  run: (msg, args) => {
    let prefix = []
    if (!config.prefix) { // If there is no prefix
      prefix.push('s!') // Push 'S!'
    } else { // If None of the above stated statements are true
      prefix.push(config.prefix) // Push the prefix in the config.json file
    }
    if (!args[0]) { // If no args
      bot.getRESTUser('323673862971588609').then((RESTUser) => { // Get a rest user
        bot.createMessage(msg.channel.id, { // Create a message
          embed: { // A embed
            title: 'Info', // The embed title
            description: `Screenshot bot V1.0.0 by ${RESTUser.username}#${RESTUser.discriminator}`, // The description
            color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)), // The embed color
            fields: [ // Fields
              { name: 'Bot owned by',
                value: `${config.owner.name}#${config.owner.discrim} (${config.owner.id})` },
              { name: 'prefix',
                value: `${prefix} or ${bot.user.mention}` },
              { name: 'uptime',
                value: `${moment.duration(bot.uptime).humanize()}` }
            ],
            footer: { text: `Called by ${msg.author.username}#${msg.author.discriminator}` }, // The footer
            timestamp: new Date() // The timestamp of the embed (Right after the footer)
          }
        }).catch(() => null) // Catch the createMessage error (Probably a permission error)
      })
    } else if (args[0] && args[0].toLowerCase() === 'get') { // If args zero and args zero lowercased equals 'get'
      bot.createMessage(msg.channel.id, 'Ok, so you want the bot.. You can get it via this link: https://github.com/VoidNulll/screenshot-bot/').catch(() => null) // Create a message and catch any create message errors
    }
  }
})
