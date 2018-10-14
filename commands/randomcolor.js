const randomColor = require('randomcolor')

/* eslint max-statements: [error, 12] */
/* eslint max-lines-per-function: ['error', 52] */

module.exports = bot => ({
  name: 'randomcolor', // The command name
  run: (msg, args) => { // The part of the command wanted to run
    if (args[0]) { // If args 0
      const color = []
      if (args[0] === 'attractive') { // If args 0 equals attractive
        color.push(randomColor({ hue: 'random' })) // Push the randomColor to colro
        bot.createMessage(msg.channel.id, { // Create a message
          embed: { // The message embed
            color: Number('0x' + color.toString().slice(1)), // The color
            description: `Color: ${color.toString()}` // The embed description
          }
        }).catch(() => null) // Catch any create message errors
      } else if (args[0] === 'attractive' && args[1]) { // If args 0 equals attractive and args 1 is not undefined
        color.push(randomColor({ hue: args[1] })) // Push randomcolor to color
        bot.createMessage(msg.channel.id, { // Create a message
          embed: { // The message ambed
            color: Number('0x' + color.toString().slice(1)), // The embed color
            description: `Color: ${color.toString()}` // The embed description
          }
        }).catch(() => null) // Catch any create message errors
      } else { // else
        color.push(randomColor({ hue: args[0], // Push random color to color
          luminosity: 'random' }))
        bot.createMessage(msg.channel.id, { // Create a message
          embed: { // The message embed
            color: Number('0x' + color.toString().slice(1)), // The embed color
            description: `Color: ${color.toString()}` // the embed description
          }
        }).catch(() => null) // Catch any createMessage errors
      }
    } else { // else
      const color = [] // Redefine color
      color.push(randomColor({ hue: 'random', // Push a randomColor to colors
        luminosity: 'random' }))
      bot.createMessage(msg.channel.id, { // Create a message
        embed: { // The message embed
          color: Number('0x' + color.toString().slice(1)), // The message embed
          description: `Color: ${color.toString()}` // The embed description
        }
      }).catch(() => null) // Catch any create Message errors
    }
  }
})
