/* eslint-disable camelcase */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
const randomColor = require('randomcolor')
const moment = require('moment')
const resolve = require('../functions/resolveMember')
const config = require('../../config');
const checkBlacklist = require('../functions/checkForBlacklist')

function spotifyGame (member, title) {
  let listened = new Date() - member.game.timestamps.start
  let total = member.game.timestamps.end - member.game.timestamps.start;
  listened = moment.duration(listened, 'milliseconds').format('m[:]ss');
  if (!listened.match(/d{1,2}\:/)) {
    listened = `0:${listened}`
  }
  let mess = {
    embed: {
      author: {
        icon_url: 'https://cdn.discordapp.com/attachments/358674161566220288/496894273304920064/2000px-Spotify_logo_without_text.png',
        name: title,
        url: 'https://spotify.com'
      },
      description: `${listened}/${moment.duration(total, 'milliseconds').format('m[:]ss')}`,
      color: Number('0x' + randomColor({ hue: 'green' }).slice(1)),
      fields: [
        {
          name: 'Song',
          value: member.game.details
        },
        {
          name: 'Album',
          value: member.game.assets.large_text
        },
        {
          name: 'Artist',
          value: member.game.state,
          inline: true
        }
      ],
      thumbnail: {
        url: `https://i.scdn.co/image/${member.game.assets.large_image.slice(8)}`
      },
      footer: { text: `${member.user.username}#${member.user.discriminator}`, icon_url: member.avatarURL }
    }
  }
  return mess;
}

function game (member) {
  let fields = [];
  let types = { 0: 'Playing',
    1: 'Streaming on Twitch',
    2: 'Listening to',
    3: 'Watching' }
  let mess = {
    embed: {
      title: 'Game',
      color: Number('0x' + randomColor().slice(1)),
      footer: { text: `${member.user.username}#${member.user.discriminator}`, icon_url: member.avatarURL }
    }
  }
  if (!member.game) {
    mess.embed.title = 'Game: Error'
    mess.embed.description = `${member.user.username} Is not playing any game!`
    mess.embed.color = Number('0x' + randomColor({ hue: 'red' }).slice(1))
    return mess
  }
  mess.embed.title = `${member.user.username} is ${types[member.game.type]} ${member.game.name}`
  if (member.game.name === 'Spotify') {
    return spotifyGame(member, mess.embed.title)
  }
  if (member.game.state) {
    fields.push({ name: 'State',
    value: member.game.state,
    inline: true })
  }
  if (member.game.details) {
    fields.push({ name: 'Details',
    value: member.game.details,
    inline: true })
  }
  if (member.game.timestamps) {
    if (member.game.timestamps.start && !member.game.timestamps.end) {
      let elapsed = new Date() - member.game.timestamps.start
      fields.push({ name: 'Time Elapsed',
      value: moment.duration(elapsed, 'millisecond').format('d [Days,] h [Hours,] m [Minutes, and] s [Seconds]'),
      inline: true })
    } else if (member.game.timestamps.start && member.game.timestamps.end) {
      let left = member.game.timestamps.start - new Date()
      let total = member.game.timestamps.end - member.game.timestamps.start;
      let elapsed = new Date() - member.game.timestamps.start
      elapsed = moment.duration(elapsed, 'milliseconds').format('d [Days,] h [Hours,] m[:]ss');
      if (!elapsed.match(/d{1,2}\:/)) {
          elapsed = `0:${listened}`
      }
      fields.push(
        { name: 'Time',
          value: `Time played: ${elapsed} out of ${total}\nTime Left: ${left}`,
          inline: true
        },
      )
    }
  }
  if (member.game.assets) {
    if (member.game.assets.large_image) {
      mess.embed.thumbnail = { url: `https://cdn.discordapp.com/app-assets/${member.game.application_id}/${member.game.assets.large_image}` }
      if (member.game.assets.large_text) {
        mess.embed.description = `${member.game.assets.large_text}`
      }
    }
    if (member.game.assets.small_image) {
      mess.embed.author = { icon_url: `https://cdn.discordapp.com/app-assets/${member.game.application_id}/${member.game.assets.small_image}` }
      if (member.game.assets.small_text) {
        mess.embed.author.name = member.game.assets.small_text
      }
    }
  }
  if (fields.length > 0) {
    mess.embed.fields = fields
  }
  return mess
}

module.exports = bot => ({
  name: 'game',
  run: async (msg, args) => {
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    let member = msg.member
    if (args[0]) {
      member = resolve(msg.channel.guild, args.join(' '));
      if (!member) {
        return bot.createMessage(msg.channel.id, `User \`${args.join(' ')}\` not found!`)
      }
    }
    let gme = game(member);
    return bot.createMessage(msg.channel.id, gme)
  },
  options: {
    usage: 'game (user)',
    description: 'Shows a users game (if any)'
  }
})
