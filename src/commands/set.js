/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable no-ternary */
// Require stuff
const config = require('../../config')
const request = require('superagent')
const randomColor = require('randomcolor')

let options = [
  'username',
  'name',
  'avatar'
]

module.exports = bot => ({
  name: 'set',
  run: async (msg, args) => {
    if (config.owner.id !== msg.author.id) return null
    if (!args[0] || !options.includes(args[0])) {
      return bot.createMessage(msg.channel.id, `Please choose from one of these options: \`${options.join(', ')}\`. Command cancelled`)
    }
    if (args[0].match(/name|username/)) {
      try {
        let self = await bot.editSelf({ username: args.slice(1).join(' ') })
        return bot.createMessage(msg.channel.id, `Updated my name to ${self.username}!`)
      } catch (err) {
        return bot.createMessage(msg.channel.id, `There was a error editing my avatar. Perhaps this is useful.\n\`\`\`${err.message
          ? err.message
          : err}\`\`\``)
      }
    }
    if (args[0].match(/avatar/)) {
      try {
        let url = msg.attachments && msg.attachments[0]
          ? msg.attachments[0].url
          : args[1]
        let av = await request.get(url)
        let data = `data:${av.headers['content-type']};base64.${av.body.toString('base64')}`
        let self = await bot.editSelf({ avatar: data })
        return bot.createMessage(msg.channel.id, {
          embed: {
            description: 'Updated my avatar to:',
            thumbnail: { url: self.avatarURL },
            color: Number('0x' + randomColor().slice(1))
          }
        })
      } catch (err) {
        return bot.createMessage(msg.channel.id, `Whoops! Something happned! Check below (if its useful, i dont know)\n\`\`\`${err.message
          ? err.message
          : err}\`\`\``)
      }
      return bot.createMessage(msg.channel.id, `Please choose from one of these options: \`${options.join(', ')}\`. Command cancelled`)
    }
  },
  options: {
    description: 'Change the bots avatar/username',
    limitedto: 'Bot owner',
    subcommands: [
      {
        label: '{username|name} [name]',
        description: 'Change the bots username'
      },
      {
        label: 'avatar [link]',
        description: 'Change the bots avatar'
      }
    ]
  }
})
