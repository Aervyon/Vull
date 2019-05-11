const config = require('../../config');
const checkBlacklist = require('../functions/checkForBlacklist');

module.exports = bot => ({
  name: 'nick', // The command name
  run: async (msg, args) => { // The part of the command wanted to run
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    let member = msg.member // Define member as msg.member
    let nick = args.join(' ') // Define nick as args.join(' ')
    if (!member.permission.has('manageNicknames' || 'manageGuild' || 'manageServer')) return null // If no perms...
    try {
      if (!args[0]) {
        bot.editNickname(msg.channel.guild.id, '')
        return bot.createMessage(msg.channel.id, 'Reset my nickname!')
      }
      bot.editNickname(msg.channel.guild.id, nick, `User responsible: ${msg.author.username} (${msg.author.id})`)
      bot.createMessage(msg.channel.id, `Set my nickname to ${nick}!`)
    } catch (err) {
      return bot.createMessage(msg.channel.id, 'Unable to change my nickname!')
    }
  },
  options: {
    description: 'Change the bots nickname',
    usage: 'nick (user)',
    limitedto: 'Administrators/Managers'
  }
})
