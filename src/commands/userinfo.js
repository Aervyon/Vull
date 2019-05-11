/* eslint-disable no-ternary */
const moment = require('moment')
const config = require('../../config')
const resolver = require('../functions/resolveMember')
const randomColor = require('randomcolor')
const checkBlacklist = require('../functions/checkForBlacklist')
/* eslint max-statements: [error, 60] */
/* eslint max-lines-per-function: [error, 226] */
/* eslint complexity: [error, 50] */

async function restUser (client, id) {
  let user
  let mess
  let ack = []

  try {
    user = await client.getRESTUser(id);
  } catch (err) {
    return 'User not found!'
  }

  if (user.id === '323673862971588609') {
    ack.push('Bot Developer')
  }
  if (user.id === config.owner.id) {
    ack.push('Bot Owner')
  }

  mess = {
    embed: {
      title: 'Userinfo',
      description: `${user.username}#${user.discriminator} (${user.id})`,
      thumbnail: {
        url: user.avatarURL
      },
      footer: { text: 'Found user via REST, user is not in guild!' },
      timestamp: new Date(),
      color: Number('0x' + randomColor().slice(1))
    }
  }

  return mess;

}

module.exports = bot => ({
  name: 'userinfo',
  run: async (msg, args) => {
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    let ack = [];
    let member = msg.member;
    if (args[0]) {
      member = resolver(msg.channel.guild, args[0]);
      if (!member) {
        let message = await restUser(bot, args[0])
        return bot.createMessage(msg.channel.id, message).catch(() => { /* - */ });
      }
    }
    if (member.id === '323673862971588609') {
      ack.push('Bot Developer')
    }
    if (member.id === config.owner.id) {
      ack.push('Bot Owner')
    }
    if (member.id === msg.channel.guild.ownerID) {
      ack.push('Server Owner')
    }
    if (member.permission.has('administrator') && !ack.includes('Server Owner')) {
      ack.push('Server Administrator')
    }
    if (member.permission.has('manageGuild') && !ack.includes('Server Owner') && !ack.includes('Server Administrator')) {
      ack.push('Server Manager')
    }
    let mess = {
      title: `Userinfo ${member.user.username}`,
      color: Number('0x' + randomColor().slice(1)),
      description: member.nick
        ? `<@!${member.id}>`
        : `<@${member.id}>`,
      fields: [
        {
          name: 'Joined At',
          value: moment(member.joinedAt).format('ddd, MMMM Do YYYY [at] h:m:s A')
        },
        {
          name: 'Registered At',
          value: moment(member.createdAt).format('ddd, MMMM Do YYYY [at] h:m:s A')
        },
        {
          name: 'Status',
          value: member.status
        }
      ],
      thumbnail: {
        url: member.user.avatarURL
      },
      footer: { text: `ID: ${member.id}` },
      timestamp: new Date()
    }
    if (member.nick && member.nick !== member.user.username) {
      mess.fields.push({ name: 'Nickname',
      value: member.nick })
    }
    if (member.game) {
      let types = { 0: 'Playing',
      1: 'Streaming on Twitch',
      2: 'Listening to',
      3: 'Watching' }
      let type = types[member.game.type];
      let details = member.game.details
      ? `\n${member.game.details}`
      : ''
      let full = `${type} ${member.game.name}` + details
      mess.fields.push({ name: 'Game',
     value: full })
    }
    if (member.roles.length > 0) {
      let roles = [];
      for (const role of member.roles) {
        roles.push(`<@&${role}>`)
      }
      if (roles.join(' ').length > 1024) {
        mess.fields.push({ name: `Roles [${member.roles.length}]`,
        value: 'Too many characters to display roles' })
      } else {
        mess.fields.push({ name: `Roles [${member.roles.length}]`,
        value: roles.join(' ') })
      }
    }
    if (ack.length > 0) {
      mess.fields.push({ name: 'Acknowledgements',
      value: ack.join(', ') })
    }

    bot.createMessage(msg.channel.id, { embed: mess })
  },
  options: {
    description: 'Get info on a user',
    aliases: ['whois'],
    usage: 'userinfo (user)'
  }
})
