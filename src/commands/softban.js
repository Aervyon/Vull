const config = require('../../config');
const checkBlacklist = require('../functions/checkForBlacklist')

/* eslint max-statements: [error, 18] */
module.exports = bot => ({
  name: 'softban',
  run: async (msg, args) => { /* eslint-disable */
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    if (!msg.member.permission.has('banMembers' || 'administrator' || 'manageGuild')) return null /* eslint-enable */
    if (!args[0]) {
      bot.createMessage(msg.channel.id, 'Please provide a member to softban').catch(() => { /* - */ })
      return null
    } /* eslint-disable */
    let user = msg.channel.guild.members.get(args[0]) || msg.channel.guild.members.find(member => member.username.toLowerCase().startsWith(args[0].toLowerCase()) || (member.nick && member.nick.toLowerCase().startsWith(args[0].toLowerCase())) || member.mention === args[0]) /* eslint-enable */
    let reason = args.slice(1).join(' ') || 'No reason given'
    console.log(`${user}\n${reason}`)
    msg.delete().catch(() => { /* - */ })
    if (!user) {
      bot.getRESTUser(args[0]).then((RESTUser) => {
        bot.banGuildMember(msg.channel.guild.id, RESTUser.id, 7, reason).then(() => {
          bot.unbanGuildMember(msg.channel.guild.id, RESTUser.id, reason)
          bot.createMessage(msg.channel.id, `${RESTUser.username}#${RESTUser.discriminator} was softbanned by ${msg.author.username}#${msg.author.discriminator} for: ${reason}`).catch(() => { /* - */ })
        }).catch(() => {
          // Oke
        })
      }).catch((err) => {
        bot.createMessage(msg.channel.id, `Error: ${err.message}`).catch(() => { /* - */ })
      })
      return null
    }
    if (user.permission.has('administrator') || user.permission.has('manageGuild')) {
      bot.createMessage(msg.channel.id, 'That user has admin perms, i will not ban').catch(() => { /* - */ })
      return null
    }
    msg.channel.guild.banMember(user.id, 7, reason).then(() => {
      bot.unbanGuildMember(msg.channel.guild.id, user.id, reason)
      bot.createMessage(msg.channel.id, `${user.username}#${user.discriminator} was softbanned by ${msg.author.username}#${msg.author.discriminator} for: ${reason}`).catch(() => { /* - */ })
    }).catch(() => {
      bot.createMessage(msg.channel.id, 'Unable to ban user, i do not have permissions to ban!').catch(() => { /* - */ })
    })
  },
  options: {
    description: 'Ban a user, and unban them',
    usage: 'softban [user] (reason)',
    limitedto: 'Administrators, Managers, or people with ban permissions'
  }
})
