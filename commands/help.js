// Requires

const randomColor = require('randomcolor')
const config = require('../config')

const helps = require('../helps')

// ESLint rules

/* eslint max-statements: ['error', 19] */
/* eslint max-lines-per-function: ['error', 91] */
/* eslint complexity: [error, 26] */
/* eslint max-statements-per-line: ["error", { "max": 2 }] */

// Export the command

module.exports = bot => ({
  name: 'help', // Command name
  run: (msg, args) => { // The part of the command that is important
    if (!args[0]) { // If no arguements
      bot.createMessage(msg.channel.id, {
        embed: {
          title: 'Help', // Embed title
          color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)), // A random color
          fields: [ // The fields
            { name: 'Commands eveyone can use',
              value: `${helps.everyone.join('\n')}` },
            { name: 'Admin commands',
              value: `${helps.admin.join('\n')}` },
            { name: 'Bot owner only',
              value: `${helps.owner.join('\n')}` }
          ],
          timestamp: new Date(), // The timestamp
          footer: { name: `Called by: ${msg.member.name}#${msg.member.discriminator}` } // The footer
        }
      }).catch(() => null) // Catch any message creation errors
    } else if (args[0] && helps.names.includes(args[0].toLowerCase())) { // If the names includes the args
      for (let help of helps.helps) { // run through the helps array
        if (args[0].toLowerCase() === help.name) { // if command = args
          if (help.type === 'everyone' && !help.usage) { // if type is everyone and there is no usage
            bot.createMessage(msg.channel.id, { // create a message
              embed: {
                color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)),
                title: `Help: ${help.name}`,
                description: `**Description:** ${help.fullDesc}`
              }
            }).catch(() => null)
          } else if (help.type === 'everyone' && help.usage) { // if there is a usage and help type is everyone
            bot.createMessage(msg.channel.id, { // create a message
              embed: {
                color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)),
                title: `Help: ${help.name}`,
                description: `**Description:** ${help.fullDesc} \n**Usage:** ${msg.prefix}${help.usage} \n**Example:** ${msg.prefix}${help.example}`
              }
            }).catch(() => null)
          } else if (help.type === 'admin' && (msg.member.permission.has('administrator') || msg.member.permission.has('manageGuild') || msg.member.permission.has('manageRoles')) && !help.usage) { // if type is admin and all permissions are cleared
            bot.createMessage(msg.channel.id, { // create message
              embed: {
                color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)),
                title: `Help: ${help.name}`,
                description: `**Description:** ${help.fullDesc}`
              }
            }).catch(() => null)
          } else if (help.type === 'admin' && (msg.member.permission.has('administrator') || msg.member.permission.has('manageGuild') || msg.member.permission.has('manageRoles')) && help.usage) { // if usage and type is admin (as well as check for permissions)
            bot.createMessage(msg.channel.id, { // create message
              embed: {
                color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)),
                title: `Help: ${help.name}`,
                description: `**Description:** ${help.fullDesc} \n**Usage:** ${msg.prefix}${help.usage} \n**Example:** ${msg.prefix}${help.example}`
              }
            }).catch(() => null)
          } else if (help.type === 'owner' && msg.member.id === config.owner.id && !help.usage) { // if type is owner and user id is owner id
            bot.createMessage(msg.channel.id, { // create message
              embed: {
                color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)),
                title: `Help: ${help.name}`,
                description: `**Description:** ${help.fullDesc}`
              }
            }).catch(() => null)
          } else if (help.type === 'owner' && msg.member.id === config.owner.id && help.usage) { // if usage, type is owner, and user id is the owner id
            bot.createMessage(msg.channel.id, { // create message
              embed: {
                color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)),
                title: `Help: ${help.name}`,
                description: `**Description:** ${help.fullDesc} \n**Usage:** ${msg.prefix}${help.usage} \n**Example:** ${msg.prefix}${help.example}`
              }
            }).catch(() => null)
          }
        }
      }
    } else { // If the args are not found in the names array
      bot.createMessage(msg.channel.id, 'Unknown command')
    }
  }
})
