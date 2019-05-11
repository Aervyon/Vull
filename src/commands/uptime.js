const moment = require('moment') /* eslint-disable */
const momentDurationFormatSetup = require("moment-duration-format") /* eslint-enable */
const randomColor = require('randomcolor')
const os = require('os')

const checkBlacklist = require('../functions/checkForBlacklist')
const config = require('../../config')

/* eslint-disable max-statements */
/* eslint-disable init-declarations */
// eslint-disable-next-line max-params
function sendUptime (option, uptimes, msg, bot) {
  let blacklisted = checkBlacklist('User', msg.author.id);
  if (blacklisted && msg.author.id !== config.owner.id) {
      return;
  }
  let up;
  let opt = option
  let options = {
    client: 'Client Uptime',
    process: 'Process Uptime',
    system: 'System Uptime'
  }
  let cbReg = /client|bot/
  if (cbReg.test(opt)) {
    opt = 'client'
  }
  if (!uptimes[opt]) {
    return bot.createMessage(msg.channel.id, 'Invalid option! Options are: `client`/`bot`, `process`, or `system`')
  }
  up = uptimes[opt]
  opt[0] = opt[0].toUpperCase()
  return bot.createMessage(msg.channel.id, {
    embed: {
      color: Number('0x' + randomColor().slice(1)),
      title: options[opt],
      description: up
    }
  })
}

module.exports = bot => ({
  name: 'uptime',
  run: (msg, args) => {
    let sUptime = `${moment.duration(os.uptime(), 'seconds').format('M [months], w [weeks], d [days], h [hours], m [minutes], [and] s [seconds]')}`
    let pUptime = `${moment.duration(process.uptime(), 'seconds').format('M [months], w [weeks], d [days], h [hours], m [minutes], [and] s [seconds]')}`
    let cUptime = `${moment.duration(bot.uptime, 'milliseconds').format('M [months], w [weeks], d [days], h [hours], m [minutes], [and] s [seconds]')}`
    let uptimes = { system: sUptime,
      process: pUptime,
      client: cUptime }
    if (args[0]) {
      return sendUptime(args[0].toLowerCase(), uptimes, msg, bot)
    }
    bot.createMessage(msg.channel.id, {
      embed: {
        color: Number('0x' + randomColor().slice(1)),
        author: {
          name: 'Uptime', /* eslint-disable */
          icon_url: bot.user.avatarURL /* eslint-enable */,
          url: 'https://github.com/VoidNulll/Vull'
        },
        fields: [
          {
            name: 'Process Uptime',
            value: pUptime
          },
          {
            name: 'Client Uptime',
            value: cUptime,
            inline: true
          },
          {
            name: 'System Uptime',
            value: sUptime,
            inline: true
          }
        ]
      }
    })
  },
  options: {
    description: 'Get the bots uptime',
    usage: 'uptime (option)',
    aliases: ['uptime']
  }
})
