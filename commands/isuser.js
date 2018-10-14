const randomColor = require('randomcolor') // Require random color

// ESLint rule overrides

/* eslint max-lines-per-function: ['error', 52] */

module.exports = bot => ({
  name: 'isUser',
  run: (msg, args) => {
    let uzer = args[0]
    if (!args[0]) { // If no arguments
      bot.createMessage(msg.channel.id, `Please provide a user id. \nExample usage: ${msg.prefix}isUser 323673862971588609`).catch(() => null) // Tell them there is no user id and give an example
      return null
    } else if (args[0]) { // If arguments
      if (msg.channel.guild.channels.get(uzer)) { // If the id is a channel id
        bot.createMessage(msg.channel.id, 'Uh.. Thats a channel id').catch(() => null) // Tell the user its a channel id
        return null
      }
      bot.getRESTUser(uzer).then((user) => {
        let av = []
        if (user.avatar.includes('a_')) { // the avatar is a gif
          av.push(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif?size=128`) // Push a gif styled avatar
        } else {
          av.push(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`) // Push a png avatar
        }
        bot.createMessage(msg.channel.id, { // Create a message
          embed: {
            title: 'Found the user', // The embed title
            color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)), // The color
            timestamp: new Date(), // The timestamp
            fields: [ // The embed fields
              {
                name: 'Name',
                value: `${user.username}#${user.discriminator}`
              },
              {
                name: 'ID',
                value: `${user.id}`
              },
              {
                name: 'Avatar URL',
                value: av[0]
              }
            ],
            thumbnail: { url: av[0] } // The embed thumbnail
          }
        }).catch(() => null) // Catch createMessage errors
      }).catch(() => bot.createMessage(msg.channel.id, 'Error! Could not find user!\n*Is that even a user id?*')) // Catch the getRESTUser errors
    }
  },
  help: {
    desc: 'Checks for user via the **REST API**',
    fullDesc: 'Checks for user by id via the **REST** api.',
    usage: 'isUser [id]',
    example: 'isUser 323673862971588609',
    type: 'everyone'
  }
})
