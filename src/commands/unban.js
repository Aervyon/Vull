const checkBlacklist = require('../functions/checkForBlacklist');
const config = require('../../config')

/* eslint-disable no-ternary */
/* eslint-disable max-statements */
module.exports = bot => ({ // The command
  name: 'unban', // The command name
  run: async (msg, args) => { // What actually gets ran by the command
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    if (!msg.member.permission.has('banMembers' || 'manageGuild' || 'administrator')) return null // If no perms, stop the command
    if (!args[0]) { // If no args for the command
      bot.createMessage(msg.channel.id, 'Please state a user to unban (unban only works with ID).').catch(() => { /* - */ }) // Tell the author to state a user
      return null // Stop the command
    }
    let reason = args.slice(1).join(' ') || 'No Reason' // The reason for unbanning the user
    let user
    try {
      user = await bot.getRESTUser(args[0])
    } catch (err) {
      return bot.createMessage(msg.channel.id, 'Cannot find the user!')
    }
    if (!user) {
      return bot.createMessage(msg.channel.id, 'User not found!')
    }
    let sent
    let ban
    try {
      ban = await bot.unbanGuildMember(msg.channel.guild.id, user.id, reason)
    } catch (err) {
      let er = err.message
      ? err.message
      : err
      if (er === 'DiscordRESTError [10026]: Unknown Ban') {
        sent = true
        return bot.createMessage(msg.channel.id, 'User was not banned!')
      }
      sent = true
      return bot.createMessage(msg.channel.id, 'Cannot unban member!')
    }
    return bot.createMessage(msg.channel.id, !sent && ban
      ? `${user.username} was banned!`
      : `Could not ban ${user.username}`)
  },
  options: {
    description: 'Unban a user via ID',
    usage: 'unban [UserID]',
    limitedto: 'Administrators, Managers, and people with ban permissions'
  }
})
