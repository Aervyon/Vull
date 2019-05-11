/* eslint-disable max-lines-per-function */
const randomColor = require('randomcolor')
const config = require('../../config')
const moment = require('moment')
const Guild = require('../models/guild');

module.exports = bot => ({
  name: 'info',
  run: async (msg) => {
    let prefix = config.prefix || 'vull '
    const guild = await Guild.findOne({ ID: msg.channel.guild.id }).exec()
    const RESTUser = await bot.getRESTUser('323673862971588609') || { username: 'Null',
      discriminator: '0515' }
      let mess = { // Create a message
        embed: { // A embed
          title: 'Info', // The embed title
          description: `Vull V1.0.0 by ${RESTUser.username}#${RESTUser.discriminator}`, // The description
          color: Number('0x' + randomColor().slice(1)), // The embed color
          fields: [ // Fields
            { name: 'Bot owned by',
              value: `${config.owner.name}#${config.owner.discrim} (${config.owner.id})`,
              inline: true },
            { name: 'Default Prefix',
              value: `\`${prefix}\` or ${bot.user.mention}`,
              inline: true },
            { name: 'Uptime',
              value: `${moment.duration(bot.uptime, 'milliseconds').format('M [months], w [weeks], d [days], h [hours], m [minutes], s [seconds]')}`,
              inline: true
            },
            {
              name: 'Server Count',
              value: bot.guilds.size,
              inline: true
            },
            {
              name: 'Language',
              value: 'JavaScript',
              inline: true
            }
          ],
          timestamp: new Date() // The timestamp of the embed (Right after the footer)
        }
      }
    if (guild && guild.prefix && guild.prefix !== prefix) {
      mess.embed.fields.push({ name: 'Guild Prefix',
        value: `\`${guild.prefix}\` `,
        inline: true })
    }
    return bot.createMessage(msg.channel.id, mess) // Catch the createMessage error (Probably a permission error)
  },
  options: {
    description: 'Gives you the bots info'
  }
})
