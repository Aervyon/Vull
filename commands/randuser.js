const randomColor = require('randomcolor')
const moment = require('moment')

/* eslint max-statements: ['error', 15] */
/* eslint max-lines-per-function: ['error', 54] */

module.exports = bot => ({
  name: 'randuser',
  run: (msg) => {
    let mems = msg.channel.guild.members.filter(member => !member.bot) // Filter through the guild members
    let randuser = Math.round(Math.random() * mems.length) // A random nm=umber
    randuser = mems[randuser] // A random user
    let roles = [] // Define roles
    randuser = msg.channel.guild.members.get(randuser.id) // Get the user
    if (!msg.member.roles) { // If no roles
      roles.push('null') // Push string null to roles
    } else { // Else
      for (let role of randuser.roles) { // Loop through the users roles
        let nRole = msg.channel.guild.roles.get(role) // Define nRole
        roles.push(nRole.mention) // Push the role mention to roles
      }
    }
    let av = [] // Define av
    if (randuser.avatarURL.includes('a_')) { // If the randusers includes 'a_' (If its a gif)
      av.push(`https://cdn.discordapp.com/avatars/${randuser.id}/${randuser.avatar}.gif?size=128`) // Push this string to av
    } else { // Else
      av.push(`https://cdn.discordapp.com/avatars/${randuser.id}/${randuser.avatar}.png?size=128`) // Push this string to av
    }
    bot.createMessage(msg.channel.id, { // Create a message
      embed: {
        title: 'Found a random person!', // The embed title
        color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)), // The embed color
        fields: [ // The embed fields
          { name: 'Name',
            value: randuser.username + '#' + randuser.discriminator,
            inline: true }, // randusers name field
          { name: 'Status',
            value: randuser.status,
            inline: true }, // Status field
          { name: 'Avatar link',
            value: av[0] }, // Avatar Link Field
          { name: 'JoinedAt',
            value: moment(randuser.joinedAt).format('MMMM Do YYYY, h:mm:ss a'),
            inline: true }, // Joined at field
          { name: 'Roles',
            value: roles.join(', ') || 'None',
            inline: true } // Role field
        ],
        timestamp: new Date(), // The embed date
        thumbnail: { url: av[0] }, // The embed thumbnail
        footer: { text: `ID: ${randuser.id}` } // The footer
      }
    }).catch(() => null) // Catch any createMessage errors
  },
  help: {
    type: 'everyone',
    desc: 'Picks a random user',
    fullDesc: 'Picks a random user out of the server members that are not bots'
  }
})
