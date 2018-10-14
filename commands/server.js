// Database stuff
const Datastore = require('nedb')
const config = require('../config')

let db = new Datastore({ filename: './db/servers',
  autoload: true })

// Eslint rule overrides

/* eslint max-statements: off */
/* eslint array-element-newline: off */

module.exports = bot => ({
  name: 'server', // Command name
  run: (msg, args) => { // What i want the command to do
    if (!args[0]) { // If no args
      bot.createMessage(msg.channel.id, bot.guilds.map(guild => guild.name).join(',\n')).catch(() => null) // Create a message
    } else if (args[0] && args[0].toLowerCase() === 'add') { // If args and args equals add
      if (msg.member.id === config.owner.id) { // If the person who sent the command's id is the config owner id
        let server = args[1] // Define server
        if (!server) { // If there is no server
          bot.createMessage(msg.channel.id, 'Please provide a server ID').catch(() => null) // Create a message
        } else { // If there is a server
          let servr = { ID: server,
            prefix: config.prefix } // Define servr (object)
          db.insert(servr, (err) => { // Insert servr into the database
            if (err) { // If there is a error
              console.log(err) // Log the error
              bot.createMessage(msg.channel.id, 'An error has occurred, check your console for more details').catch(() => null) // Tell the user there has been a error
            } else bot.createMessage(msg.channel.id, `Added server ${server} to the database.`) // If no errors, tell the user the servr was updated to the database
          })
        }
      }
    } else if (args[0] && args[0].toLowerCase() === 'remove') { // If args and args equals remove
      if (msg.member.id === config.owner.id) { // If the user who sent the command's id equals the (configs) owner id
        let server = args[1] // Define server
        if (!server) { // If no server
          bot.createMessage(msg.channel.id, 'Please provide a server ID').catch(() => null) // Tell them to provide a server id
        } else { // If there is a server
          db.remove({ ID: server }, (err) => { // Remove the server from the database
            if (err) { // If any erros
              console.log(err) // Log the erros
              bot.createMessage(msg.channel.id, 'An error has occurred, check your console for more details').catch(() => null) // Tell the user about the error
            } else { // else (if there are no errors)
              bot.createMessage(msg.channel.id, `Removed Guild (ID): ${server} from the database!`).catch(() => null) // Tell them the server was removed from the database
              if (bot.guilds.map(guild => guild.id).includes(server)) bot.registerGuildPrefix(server, [config.prefix, '@mention']) // If the bot is in the guild, set the guildPrefix to the original.
            }
          })
        }
      }
    }
  },
  help: {
    type: 'owner',
    desc: 'Adds a server to the database',
    fullDesc: 'Adds a server to the database (so it can use the prefix command and have custom prefixes)',
    usage: 'server [server ID]',
    example: 'server 483040770580807700'
  }
})
