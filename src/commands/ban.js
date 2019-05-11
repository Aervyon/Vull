/* eslint-disable object-property-newline */
/* eslint-disable max-statements */
/* eslint-disable no-ternary */
let config = require('../../config')
const resolver = require('../functions/resolveMember');
const checkBlacklist = require('../functions/checkForBlacklist')

/* eslint max-statements: ['error', 20] */

async function banUser (bot, msg, requirements) {
  let { user, args } = requirements
  try {
    let botUser = resolver(msg.channel.guild, bot.user.id);
    if (!botUser) {
      return bot.createMessage(msg.channel.id, 'Cannot verify my permissions! Cannot ban.')
    }
    if (!botUser.permission.has('administrator') && !botUser.permission.has('manageGuild') && !botUser.permission.has('banMembers')) {
      return 'Cannot ban! No permissions!'
    }
    let usr = user.user || user
    await bot.banGuildMember(msg.channel.guild.id, user.id, 7, args[1]
      ? args.slice(1).join(' ')
      : `User Responsible: ${msg.author.username} (${msg.author.id})`)
      return `Succesfully banned ${usr.username}#${usr.discriminator}!`
  } catch (err) {
    let er = err.message || err
    if (er.match('DiscordRESTError [50013]: Missing Permissions') || er.match('DiscordHTTPError [50013]: Missing Permissions')) {
      return 'Cannot ban user! They probably have higher roles than me.'
    }
    return 'Ban failed for some unkown reason'
  }
}

module.exports = bot => ({
  name: 'ban', // Command name
  run: async (msg, args) => { // Constructor
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    let kicke = args[0] // Define kicke
    if (!msg.member.permission.has('banMembers' || 'manageGuild' || 'adminstrator')) return null // If no permissions, stop the command
    let user = resolver(msg.channel.guild, kicke);
    let userType = 'member'
    if (!user) {
      let rUser = await bot.getRESTUser(args[0]).catch(() => bot.createMessage(msg.channel.id, 'User not found!'))
      user = rUser
      userType = 'rest'
    }
    if (userType === 'rest') {
      return bot.createMessage(msg.channel.id, await banUser(bot, msg, { user, args }))
    }
    if (user.permission.has('administrator') || msg.member.permission.has('manageGuild') || user.id === config.owner.id) {
      return bot.createMessage(msg.channel.id, 'ERROR - I cannot kick them! They are a administrator/manager!')
    }
    if (user.id === msg.member.id) {
      return bot.createMessage(msg.channel.id, 'Lets not ban ourselfs, ok? Ok.')
    }
    return bot.createMessage(msg.channel.id, await banUser(bot, msg, { user, args }))
  },
  options: {
    description: 'Ban a user',
    usage: 'ban [user]',
    limitedto: 'Administrators/managers'
  }
})
