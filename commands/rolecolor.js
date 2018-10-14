const randomColor = require('randomcolor') // Define randomcolor

// ESLint rule overrides

/* eslint max-statements: ['error', 12] */
/* eslint max-lines-per-function: ['error', 51] */

module.exports = bot => ({ // The command
  name: 'rolecolor', // The command name
  run: (msg, args) => { // What the command does
    if (!msg.member.permission.has('administrator') || !msg.member.permission.has('manageGuild') || !msg.member.permission.has('manageRoles')) return null // If the user does not have any of these permissions
    let role2 = args.slice(1).join(' ') // Defione role2 as args.slice(1).join(' ') (Gets rid of the first args and takes the rest)
    role2 = msg.channel.guild.roles.get(role2) || msg.channel.guild.roles.find(role => role.name.startsWith(role2)) || msg.channel.guild.roles.find(role => role.mention === role2) // Redefine role2 as a role
    let hex = args[0] // Define 'hex'
    if (!args.slice(1).join(' ')) bot.createMessage(msg.channel.id, 'I need a role to change the color on').catch(() => null) // If no role, tell the user
    else if (!role2) bot.createMessage(msg.channel.id, 'I can not find the role.').catch(() => null) // If the bot cannot find the role, tell the author
    else if (role2.id === msg.channel.guild.id) bot.createMessage(msg.channel.id, 'The everyone role cannot be edited').catch(() => null) // If the role equals everyone, tell the user that role cannot be edited
    else if (!hex) bot.createMessage(msg.channel.id, `I need a hex code and a role. I will also take "random" or a hue as a hex \nEx: ${msg.prefix}rolecolor random Bots`).catch(() => null) // If no hex, tell the author there is no hex therefore the bot cannot edit the roles color
    else if (Number('0x' + hex) || Number('0x' + hex.slice(1))) { // If 0x + hex
      let hex1 = [] // Define hex1
      if (hex === `#${hex.slice(1)}`) hex1.push(hex.slice(1)) // If hex equals '#' + hex.slice(1), push hex.slice(1) to hex1
      else hex1.push(hex) // Else, push hex to hex1
      bot.editRole(msg.channel.guild.id, role2.id, { // Edit the role
        color: Number('0x' + hex1[0]) // The color if the role
      }).then((role) => { // If success
        bot.createMessage(msg.channel.id, { // Create a message
          embed: { // Creater a embed
            color: Number('0x' + hex1[0]), // The embed color
            description: `Successfully changed the color for ${role.name} to #${hex1[0]}` // The embed description
          }
        }).catch(() => null) // Catch createMessage errors
      }).catch(() => { // Catch role edit errors
        bot.createMessage(msg.channel.id, 'There was a error editing the role. Please make sure i have the manage roles permission and am higher than the role your trying to edit').catch(() => null) // Tell the author there was a error, and catch createMessage errors
      })
    } else { // Else
      let color = randomColor({ hue: hex }) // Define color
      bot.editRole(msg.channel.guild.id, role2.id, { // Edit the role
        color: Number('0x' + color.slice(1)) // The role color
      }).then((role) => { // If it was a success
        bot.createMessage(msg.channel.id, { // Create a message
          embed: { // The embed
            color: Number('0x' + color.slice(1)), // The embed color
            description: `Successfully changed the color for ${role.name} to ${color}` // The embed description
          }
        }).catch(() => null) // Catch any create message errrors
      }).catch(() => { // Catch any edit role errors (most likely a permission error)
        bot.createMessage(msg.channel.id, 'There was a error editing the role. Please make sure i have the manage roles permission and am higher than the role your trying to edit').catch(() => null) // Tell the author that there was a error while editing the role (via createMessage), and catch all createMessage errors
      })
    }
  }
})
