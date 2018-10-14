module.exports = bot => ({ // The command
  name: 'unban', // The command name
  run: (msg, args) => { // What actually gets ran by the command
    if (!msg.member.permission.has('administrator') || !msg.member.permission.has('manageGuild') || !msg.member.permission.has('banMembers')) return null // If no perms, stop the command
    if (!args[0]) { // If no args for the command
      bot.createMessage(msg.channel.id, 'Please state a user to unban (unban only works with ID).').catch(() => null) // Tell the author to state a user
      return null // Stop the command
    }
    let reason = args.slice(1).join(' ') || 'No Reason' // The reason for unbanning the user
    bot.getRESTUser(args[0]).then((user) => { // attempt to get the user via rest
      msg.channel.guild.unbanMember(user.id, reason).then(() => { // Unban the user if it is a success
        bot.createMessage(msg.channel.id, `Unbanned ${user.username}#${user.discriminator}, with reason: ${reason}`).catch(() => null) // Create a message, and catch all errors
      }).catch(() => bot.createMessage(msg.channel.id, 'Unable to ban user, please make sure i have the ban members permission and my role is above the user you are trying to ban highest role.')).catch(() => null) // If there was a error, tell the author to check the bots permissions.
    }).catch(() => bot.createMessage(msg.channel.id, 'User not found, therefore i cannot unban.').catch(() => null)) // If the bot cannot find the user via REST, tell the author
  }
})
