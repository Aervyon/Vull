module.exports = bot => ({
  name: 'nick', // The command name
  run: (msg, args) => { // The part of the command wanted to run
    let member = msg.member // Define member as msg.member
    let nick = args.join(' ') // Define nick as args.join(' ')
    if (!member.permission.has('administrator') || !member.permission.has('manageGuild') || !member.permission.has('manageNicknames')) return null // If no perms...
    if (!nick && (member.permission.has('administrator') || member.permission.has('manageGuild') || member.permission.has('manageNicknames'))) { // If no nick, but permissions
      bot.createMessage(msg.channel.id, 'No new nickname specified, please specify one').catch(() => null) // Create a message, cathing all errors
    } else if (nick === '--reset' && (member.permission.has('administrator') || member.permission.has('manageGuild') || member.permission.has('manageNicknames'))) { // If nickname is '--reset' and perms are right
      bot.editNickname(msg.channel.guild.id, null, `Updated by ${member.username}`).then(() => bot.createMessage(msg.channel.id, 'Reset my nickname').catch(() => null).catch(() => bot.createMessage(msg.channel.id, 'I could not edit my nick, there is probably a permission stopping me from doing so').catch(() => null))) // Edit the nickname, create a message, and catch any errors (if it is a permission error with updating the nickname, tell the author)
    } else if (nick && nick !== '--reset' && (member.permission.has('administrator') || member.permission.has('manageGuild') || member.permission.has('manageNick'))) { // If nick, and nick does not equal '--reset', as well as if user has permissions
      bot.editNickname(msg.channel.guild.id, nick, `Updated by ${member.username}`).then(() => bot.createMessage(msg.channel.id, `Updated my nickname to ${nick}`).catch(() => null)).catch(() => bot.createMessage(msg.channel.id, 'I could not edit my nick, there is probably a permission stopping me from doing so').catch(() => null)) // Edit the nickname, and catch any errors (if it is a error while updating the nickname tell the author so)
    }
  }
})
