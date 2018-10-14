/* eslint max-statements: ['error', 11] */

module.exports = bot => ({
  name: 'kick', // Command name
  run: (msg, args) => { // Constructor
    let kicke = args[0] // Define kicke
    if (!msg.member.permission.has('administrator') || !msg.member.permission.has('manageGuild') || !msg.member.permission.has('kickMembers')) return null // If no permissions, stop the command
    if (!kicke || kicke === '') bot.createMessage(msg.channel.id, 'Please provide a user to kick.').catch(() => null) // If no user, tell the user
    else if (kicke) { // If there is a user
      let reason = args.slice(1).join(' ') || 'No Reason' // Define reason
      /* eslint no-extra-parens: off */
      let uzer = msg.channel.guild.members.get(kicke) || msg.channel.guild.members.find(member => member.username.toLowerCase().startsWith(kicke.toLowerCase()) || (member.nick && member.nick.toLowerCase().startsWith(kicke.toLowerCase()))) || msg.mentions[0] // Resolve the user
      if (!uzer) { // If the bot cannot resolve the user
        bot.createMessage(msg.channel.id, 'Unable to find user').catch(() => null) // Tell the user the bot cannot find the user
      } else {
        if (uzer.id === msg.member.id) { // If the uzer id is the authors id
          bot.createMessage(msg.channel.id, 'No, i am not kicking you. Kick someone else, self harm is not good.').catch(() => null) // Tell the author the bot will not kick them.
          return null // Stop the command
        }
        msg.channel.guild.kickMember(uzer.id, reason).then(() => { // Kick the guild member
          bot.createMessage(msg.channel.id, `Kicked ${uzer.username}#${uzer.discriminator}, with reason: ${reason}`).catch(() => null) // Create a message
        }).catch(() => bot.createMessage(msg.channel.id, 'Unable to kick user, please make sure i have the kick members permission and my role is above the highest role of the user you are trying to kick.')).catch(() => null) // If the bot was unable to kick the kicke, tell the user
      }
    }
  },
  help: {
    type: 'admin',
    desc: 'Kick someone',
    fullDesc: 'Kick someone from your server',
    usage: 'kick [member]',
    example: 'kick Null'
  }
})
