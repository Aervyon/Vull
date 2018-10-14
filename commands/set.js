// Require stuff
const config = require('../config')
const request = require('request')
const randomColor = require('randomcolor')

let options = [
  'username',
  'name',
  'avatar'
]

/* eslint max-statements: ["error", 11] */
/* eslint max-lines-per-function: ['error', 59] */

module.exports = bot => ({
  name: 'set', // The command name
  run: (msg, args) => { // What to run for the commads
    let value = args.slice(1).join(' ') // Define value
    if (!args[0] && msg.author.id === config.owner.id) { // If no args 0, and msg author id equals config owner id
      bot.createMessage(msg.channel.id, { // Create a message
        embed: { // Message embed
          title: 'Error with command: set', // The embed title
          description: `No arguments for command set. Please specify one of these: ${options.join(', ')}`, // The embed description
          timestamp: new Date(), // The embed timestamp
          color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)) // The timestamp color
        }
      }).catch(() => null) // catch any create message errors
    } else if (args[0] && args[0].toLowerCase() === ('name' || 'username')) { // if args 0 and args 0 equals name or username
      if (msg.author.id === config.owner.id) { // If msg author id equals config ownerr id
        if (!value) { // If no value
          bot.createMessage(msg.channel.id, 'I need a new username').catch(() => null) // Create a message, catching all erorrs
        } else { // If there is a value
          bot.editSelf({ username: value }).then(() => bot.createMessage(msg.channel.id, `Updated my username to ${value}`).catch(() => null)).catch((err) => { // Edit the bots username, if it was a success tell the user by creating a message (catch all errors for that)
            bot.createMessage(msg.channel.id, 'There has been a error updating my name, you are most likely trying to change it too fast.').catch(() => null) // If there is a error updating the bots name, tell the author (and tell them they are probably changing it too fast)
            console.log(err.message) // Log the error message
          })
        }
      }
    } else if (args[0] && msg.author.id === config.owner.id && args[0].toLowerCase() === 'avatar') { // If args 0 and msg author id equals config owner id, and args toLowerCase equals avatar
      if (!value) { // If no value
        bot.createMessage(msg.channel.id, 'I need a new avatar').catch(() => null) // Tell the user the bot needs a avatar by creating a message and catch all errors for the create message
      } else { // If there is a value
        request.get({ // Get the url
          url: value,
          encoding: null
        }, (err, res, body) => {
          // handle possible errors
          if (err) { // If there is a error
            msg.channel.createMessage('Error while retrieving avatar: ' + err).catch(() => null) // Tell the author through a create message (catch all errors for that)
            return null // Stop the command
          }
          // edit the avatar
          bot.editSelf({ // assuming your client is stored as bot, if not then change this
            avatar: `data:${res.headers['content-type']};base64,${body.toString('base64')}`
          }).then(() => {
            msg.channel.createMessage('Avatar updated successfully!').catch(() => null)
          }).catch(() => { // Catch any erros with updating the avatar
            msg.channel.createMessage('There was an error while uploading the new avatar, try again. You might need a different image.').catch(() => null) // Tell the user
          })
        })
      }
    } else if (args[0] && !options.includes(args[0].toLowerCase())) { // Else if args 0 is not an option
      bot.createMessage(msg.channel.id, `Thats not a option, please choose from this list: ${options.join(', ')}`).catch(() => null) // Tell the author thats not a option
    }
  }
})
