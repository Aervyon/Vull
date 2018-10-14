const Datastore = require('nedb')
const config = require('../config')

/* eslint array-element-newline: off */
/* eslint max-lines-per-function: ['error', 51] */

module.exports = bot => ({ // The command
  name: 'prefix', // The command name
  run: (msg, args) => { // The part of the command wanted to run
    if (!msg.member.permission.has('administrator') || !msg.member.permission.has('manageGuild')) return null // If no perms, end command.
    let db = new Datastore({ filename: './db/servers',
      autoload: true })
    if (!args[0]) { // If no args
      db.findOne({ ID: msg.channel.guild.id }, (err, doc) => {
        if (err) {
          console.log(err)
          bot.createMessage(msg.channel.id, 'There has been a error executing that command').catch(() => null)
          return null
        }
        if (!doc) bot.createMessage(msg.channel.id, `Prefixes: \`${config.prefix}\`, '${bot.user.mention} '\nNo prefix specified. Use \`--reset\` to reset your prefix\nNotice: You can only set one prefix, and there is always '${bot.user.mention} 'as a prefix`).catch(() => null) // Create a message, and catch errors for that
        else bot.createMessage(msg.channel.id, `Prefixes: \`${doc.prefix}\`, '${bot.user.mention} '\nNo prefix specified. Use \`--reset\` to reset your prefix\nNotice: You can only set one prefix, and there is always '${bot.user.mention} ' as a prefix`).catch(() => null) // Create a message, and catch errors for that
      })
    } else if (args[0] && args[0].toLowerCase() !== '--reset') { // If args 0, and args 0 to lowercase does not equal --reset
      db.findOne({ ID: msg.channel.guild.id }, (err, doc) => { // Find one doc
        if (err) console.log(err) // If there is a error, log it
        else if (!doc) { // If no doc
          bot.createMessage(msg.channel.id, 'Error: No database for your server found!').catch(() => null) // Tell the user
          console.log(`\nNo database for guild ${msg.channel.guild.id}`) // Log it
        } else { // Else
          db.update({ ID: msg.channel.guild.id }, { $set: { prefix: args[0].toLowerCase() } }, {}, (errr) => { // Update the database
            if (err) console.log(errr) // if there is a error, log it
            else { // If there is no error
              bot.registerGuildPrefix(msg.channel.guild.id, [args[0].toLowerCase(), '@mention ']) // Set the guild prefix
              bot.createMessage(msg.channel.id, `Updated the prefix to ${args[0].toLowerCase()}`).catch(() => null) // Create a message saying the bot created a message
            }
          })
        }
      })
    } else if (args[0] && args[0] === '--reset') { // If args and args equals reset
      db.findOne({ ID: msg.channel.guild.id }, (err, doc) => { // Find one database
        if (err) console.log(err) // If there is a error, log it
        else if (!doc) { // if there is no doc
          bot.createMessage(msg.channel.id, 'Error: No database for your server found!') // Create a message
          console.log(`\nNo database for guild ${msg.channel.guild.id}`) // Log it
        } else { // Else
          db.update({ ID: msg.channel.guild.id }, { $set: { prefix: config.prefix } }, {}, (errr) => { // Update the database
            if (errr) console.log(errr) // if error, log it
            else { // else
              bot.registerGuildPrefix(msg.channel.guild.id, [config.prefix, '@mention ']) // Register the new prefix
              bot.createMessage(msg.channel.id, 'Reset the prefix').catch(() => null) // Create a message saying the prefix has been reset
            }
          })
        }
      })
    }
  }
})
