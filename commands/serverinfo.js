// Require dependencies

const moment = require('moment')
const randomColor = require('randomcolor')

// ESLint rule overrides

/* eslint max-lines-per-function: ["error", 75] */
/* eslint camelcase: ["error", {properties: "never"}] */

module.exports = bot => ({ // The command
  name: 'serverinfo', // The command name
  run: (msg) => { // What to do
    let name = [] // Define name as array
    let own = msg.channel.guild.members.get(msg.channel.guild.ownerID) // Define own as the guild owner
    if (own.nick === ('null' || 'undefined' || null)) name.push(`${own.username}#${own.discriminator}`) // If owners nick is null, push the username and discriminator
    else name.push(`${own.username}#${own.discriminator} A.K.A ${own.nick}`) // Else, push the username and discriminator along with the owners nickname
    let icon = [] // Define icon
    if (msg.channel.guild.icon === null) { // If no guild icon
      icon.push(null) // Push null
    } else icon.push(`https://cdn.discordapp.com/icons/${msg.channel.guild.id}/${msg.channel.guild.icon}.png?size=128`) // Else, push the icon
    bot.createMessage(msg.channel.id, { // Create a message
      embed: { // The message embed
        color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)), // The embed color
        description: 'Owner: ' + name[0], // The embed description
        fields: [ // The embed fields
          {
            name: 'Region',
            value: msg.channel.guild.region,
            inline: true
          },
          {
            name: 'ID',
            value: msg.channel.guild.id,
            inline: true
          },
          {
            name: 'Text Channels',
            value: msg.channel.guild.channels.filter(channel => channel.type === 0).length,
            inline: true
          },
          {
            name: 'Voice Channels',
            value: msg.channel.guild.channels.filter(channel => channel.type === 2).length,
            inline: true
          },
          {
            name: 'Categorys',
            value: msg.channel.guild.channels.filter(channel => channel.type === 4).length,
            inline: true
          },
          {
            name: 'Roles',
            value: msg.channel.guild.roles.map(role => role.id).length,
            inline: true
          },
          {
            name: 'Members',
            value: msg.channel.guild.members.map(members => members.id).length,
            inline: true
          },
          {
            name: 'Humans',
            value: msg.channel.guild.members.filter(members => members.bot === false).length,
            inline: true
          },
          {
            name: 'Bots',
            value: msg.channel.guild.members.filter(members => members.bot).length,
            inline: true
          }
        ],
        footer: { text: `${msg.channel.guild.name} was created ${moment(msg.channel.guild.createdAt).format('MMMM Do YYYY, h:mm:ss a')}` }, // The footer. When the guild was created
        thumbnail: { url: icon[0] }, // The guild icon
        author: { name: msg.channel.guild.name, // The author for the embed
          icon_url: icon[0] }
      }
    }).catch(() => null) // Catch any create message errors
  },
  help: {
    type: 'everyone',
    desc: 'Gives you the guilds info',
    fullDesc: 'Gives you the a overview of the guilds info'
  }
})
