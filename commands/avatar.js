// Require APIs

const randomColor = require('randomcolor')

// ESLint rule overrides

/* eslint max-statements: ['error', 16] */
/* eslint consistent-return: off */
/* eslint max-lines-per-function: ['error', 56] */

module.exports = bot => ({
  name: 'avatar',
  run: (msg, args) => {
    if (!args[0] || args.join(' ') === '') { // If no arguments
      let av = [] // Define av
      if (msg.member.avatar.includes('a_')) { // the avatar is a gif
        av.push(`https://cdn.discordapp.com/avatars/${msg.member.id}/${msg.member.avatar}.gif?size=128`) // Push a gif styled avatar
      } else {
        av.push(`https://cdn.discordapp.com/avatars/${msg.member.id}/${msg.member.avatar}.png?size=128`) // Push a png avatar
      }
      bot.createMessage(msg.channel.id, { // Create a message
        embed: { // Create a embed in this message
          title: 'Avatar', // The message title
          color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)), // The message color
          description: `Avatar URL: ${av[0]}`, // The message description
          image: { // The image
            url: av[0] // The image URL
          },
          timestamp: new Date() // The little timestamp down at the bottom of the image
        }
      })
      return null // Stop the command
    }
    /* eslint no-extra-parens: off */
    let argz = args.join(' ') // Define argz
    let user = msg.channel.guild.members.get(argz) || msg.channel.guild.members.find(member => member.username.toLowerCase().startsWith(argz.toLowerCase()) || (member.nick && member.nick.toLowerCase().startsWith(argz.toLowerCase()))) || msg.mentions[0] // Resolve the user
    if (!user) { // If user is undefined
      bot.createMessage(msg.channel.id, 'User not found').catch(() => null) // Tell the user the user is not to be found
    } else { // If all statements above have not encountered something
      let av = []
      if (user.avatar.includes('a_')) { // the avatar is a gif
        av.push(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=128`) // Push a gif styled avatar
      } else {
        av.push(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`) // Push a png avatar
      }
      bot.createMessage(msg.channel.id, { // Create a message
        embed: { // Create a embed in this message
          title: 'Avatar', // The message title
          color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)), // The message color
          description: `Avatar URL: ${av[0]}`, // The message description
          image: { // The image
            url: av[0] // The image URL
          },
          timestamp: new Date() // The little timestamp down at the bottom of the image
        }
      })
    }
  }
})
