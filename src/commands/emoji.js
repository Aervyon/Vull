/* eslint-disable max-lines-per-function */
const randomColor = require('randomcolor');
const checkBlacklist = require('../functions/checkForBlacklist');
const config = require('../../config')

/* eslint max-statements: ['error', 30] */
module.exports = bot => ({
  name: 'emoji',
  run: async (msg, args) => {
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    if (!args[0]) {
      let staticE = [];
      let animated = [];
      for (const emote of msg.channel.guild.emojis) {
        if (emote.animated) {
          animated.push(`<a:${emote.name}:${emote.id}>`)
        } else {
          staticE.push(`<:${emote.name}:${emote.id}>`)
        }
      }
      let mess = {
        embed: {
          title: `Emojis: ${msg.channel.guild.emojis.length}/100`,
          color: Number('0x' + randomColor().slice(1))
        }
      }
      if (msg.channel.guild.emojis.length < 1) {
        mess.embed.description = 'No emojis here.'
      }
      const fields = [];
      if (staticE.length > 0) {
        fields.push({ name: `Static Emojis ${staticE.length}/50`,
        value: staticE.join(' ') })
      }
      if (animated.length > 0) {
        fields.push({ name: `Animated Emojis ${animated.length}/50`,
        value: animated.join(' ') })
      }
      if (fields.length > 0) {
        mess.embed.fields = fields;
      }
      return bot.createMessage(msg.channel.id, mess)
    }
    let rg = /<.*:([0-9]*)>/
    let emote = args[0]
    if (emote && emote.match(rg)[1]) {
      let id = emote.match(rg)[1]
      let mess = `https://cdn.discordapp.com/emojis/${id}.png`
      if (args[0].includes('a:')) {
        mess = `https://cdn.discordapp.com/emojis/${id}.gif`
      }
      return bot.createMessage(msg.channel.id, mess).catch(() => { /* - */ })
    }
    bot.createMessage(msg.channel.id, 'Emoji not found.').catch(() => { /* - */ })
  },
  options: {
    description: 'Shows guild emojis or enlarges a emoji',
    usage: 'emoji (emoji)'
  }
})
