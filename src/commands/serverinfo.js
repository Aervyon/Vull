/* eslint-disable max-lines-per-function */
// Require dependencies

const moment = require('moment');
const randomColor = require('randomcolor');

const config = require('../../config');
const checkBlacklist = require('../functions/checkForBlacklist');

/* eslint camelcase: ["error", {properties: "never"}] */

module.exports = bot => ({ // The command
  name: 'serverinfo', // The command name
  run: async (msg) => { // What to do
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    const own = msg.channel.guild.members.get(msg.channel.guild.ownerID) // Define own as the guild owner
    // eslint-disable-next-line no-ternary
    const name = own.nick
      ? `${own.user.username}#${own.user.discriminator} A.K.A ${own.nick}`
      : `${own.user.username}#${own.user.discriminator}`
    const icon = msg.channel.guild.iconURL
    bot.createMessage(msg.channel.id, { // Create a message
      embed: { // The message embed
        color: Number('0x' + randomColor().slice(1)), // The embed color
        description: 'Owner: ' + name, // The embed description
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
        footer: { text: `${msg.channel.guild.name} was created ${moment(msg.channel.guild.createdAt).format('MMMM Do YYYY, h:mm:ss A')}` }, // The footer. When the guild was created
        thumbnail: { url: icon }, // The guild icon
        author: { name: msg.channel.guild.name, // The author for the embed
          icon_url: icon }
      }
    }).catch(() => { /* - */ }) // Catch any create message errors
  },
  options: {
    description: 'Get server information'
  }
})
