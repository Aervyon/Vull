/* eslint max-statements: ['error', 11] */

module.exports = bot => ({
  name: 'ban',
  run: (msg, args) => { // The command constructor
    let banne = args[0] // Define banne
    if (!msg.member.permission.has('administrator') || !msg.member.permission.has('manageGuild') || !msg.member.permission.has('banMembers')) return null // If no permissions, stop the command
    if (!banne || banne === '') bot.createMessage(msg.channel.id, 'Please provide a user to ban.').catch(() => null) // If there is no user to ban, tell the user who sent the command
    else if (banne) { // If there is a user
      let reason = args.slice(1).join(' ') || 'No Reason' // Define reason
      /* eslint no-extra-parens: off */
      let uzer = msg.channel.guild.members.get(banne) || msg.channel.guild.members.find(member => member.username.toLowerCase().startsWith(banne.toLowerCase()) || (member.nick && member.nick.toLowerCase().startsWith(banne.toLowerCase()))) || msg.mentions[0] // Resolve the user
      if (!uzer) { // If no user
        bot.getRESTUser(banne).then((user) => { // Attempt to find the user via REST API
          msg.channel.guild.banMember(user.id, 7, reason).then(() => { // Ban the member if successful
            bot.createMessage(msg.channel.id, `Banned ${user.username}#${user.discriminator}, with reason: ${reason}`).catch(() => null) // Create a message telling the author that the user has been banned
          }).catch(() => bot.createMessage(msg.channel.id, 'Unable to ban user, please make sure i have the ban members permission and my role is above the user you are trying to ban highest role.')).catch(() => null) // Catch a permission error (Most likely error), and tell the user to make sure the bot can ban people
        }).catch(() => bot.createMessage(msg.channel.id, 'I could not find the user.')) // If the bot couldnt find the user via the REST api, tell the author
      } else {
        if (uzer.id === msg.member.id) { // If the uzer id is the authors id
          bot.createMessage(msg.channel.id, 'No, i am not banning you. Ban someone else, self harm is not good.').catch(() => null) // Tell the author the bot will not ban them.
          return null // Stop the command
        }
        msg.channel.guild.banMember(uzer.id, 7, reason).then(() => { // Ban the member
          bot.createMessage(msg.channel.id, `Banned ${uzer.username}#${uzer.discriminator}, with reason: ${reason}`).catch(() => null) // If it was a success, send a message
        }).catch(() => bot.createMessage(msg.channel.id, 'Unable to ban user, please make sure i have the ban members permission and my role is above the user you are trying to ban highest role.')).catch(() => null) // If there was a error, tell the author to check the bots permissions.
      }
    }
  },
  help: {
    type: 'admin',
    desc: 'Ban someone',
    fullDesc: 'Ban someone from your server',
    usage: 'ban [member]',
    example: 'ban Null'
  }
})
