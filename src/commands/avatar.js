const config = require('../../config');
const checkBlacklist = require('../functions/checkForBlacklist')

// Require APIs

// const randomColor = require('randomcolor')

// ESLint rule overrides

/* eslint max-statements: ['error', 16] */
/* eslint consistent-return: off */
const resolver = require('../functions/resolveMember');
const randomColor = require('randomcolor')

module.exports = bot => ({
  name: 'avatar',
  run: async (msg, args) => {
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    let member = msg.member;
    if (args[0]) {
      member = resolver(msg.channel.guild, args[0]);

      if (!member) {
        return bot.createMessage(msg.channel.id, 'Member not found!').catch(() => { /* - */ })
      }
    }
    let av = `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`;
      if (member.user.avatar.includes('a_')) { // the avatar is a gif
        av = `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.gif` // Change avatar to gif
      }
    bot.createMessage(msg.channel.id, {
      embed: {
        title: 'Avatar',
        image: {
          url: av
        },
        color: Number('0x' + randomColor().slice(1))
      }
    }).catch(() => { /* - */ })
  },
  options: {
    description: 'Shows yours or a users avatar',
    usage: 'avatar (user)',
    aliases: ['av']
  }
})
