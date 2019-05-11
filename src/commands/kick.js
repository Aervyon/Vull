/* eslint-disable no-ternary */
let config = require('../../config')
const resolver = require('../functions/resolveMember');
const checkBlacklist = require('../functions/checkForBlacklist')

/* eslint max-statements: ['error', 20] */

module.exports = bot => ({
  name: 'kick', // Command name
  run: async (msg, args) => { // Constructor
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    let kicke = args[0] // Define kicke
    if (!msg.member.permission.has('kickMembers' || 'manageGuild' || 'administrator')) return null // If no permissions, stop the command
    const user = resolver(msg.channel.guild, kicke);
    if (!user) {
      return bot.createMessage(msg.channel.id, 'User not found!');
    }
    if (user.permission.has('administrator') || msg.member.permission.has('manageGuild') || user.id === config.owner.id) {
      return bot.createMessage(msg.channel.id, 'ERROR - I cannot kick them! They are a administrator/manager!')
    }
    if (user.id === msg.member.id) {
      return bot.createMessage(msg.channel.id, 'Lets not kick ourselfs, ok? Ok.')
    }
    try {
      let botUser = resolver(msg.channel.guild, bot.user.id);
      if (!botUser) {
        return bot.createMessage(msg.channel.id, 'Cannot verify my permissions! Cannot kick.')
      }
      if (botUser.permission.has('administrator') || botUser.permission.has('manageGuild') || botUser.permission.has('kickMembers')) {
        return bot.createMessage(msg.channel.id, 'Cannot ban! No permissions!')
      }
      await bot.kickGuildMember(msg.channel.guild.id, user.id, 7, args[1]
        ? args.slice(1).join(' ')
        : `User Responsible: ${msg.author.username} (${msg.author.id})`)
      return bot.createMessage(msg.channel.id, `Succesfully kicked ${user.user.username}#${user.user.discriminator}!`).catch(() => { /* - */ })
    } catch (err) {
      if (err.match('DiscordRESTError [50013]: Missing Permissions') || err.match('DiscordHTTPError [50013]: Missing Permissions')) {
        return bot.createMessage(msg.channel.id, 'Cannot ban user! They are probably higher roles than me.')
      }
      return bot.createMessage(msg.channel.id, 'Something unknown happened when trying to kick them!')
    }
  },
  options: {
    description: 'Kick a user from the server',
    usage: 'kick [user]',
    limitedto: 'Administrators/Managers/People with kick members permissions'
  }
})
