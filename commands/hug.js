// Eslint rule overrides

/* eslint no-lonely-if: off */
/* eslint max-statements: [ 'error', 15 ] */
/* eslint no-extra-parens: off */
/* eslint consistent-return: off */

module.exports = bot => ({
  name: 'hug', // Name of the command
  run: (msg, args) => { // What to run
    // A random chance
    let work = [
      'failed',
      'succeeded'
    ]

    let rand = Math.round(Math.random() * work.length)
    let random = work[rand]

    if (!args[0] || args.join(' ') === ' ') { // If there are no args to the message
      bot.createMessage(msg.channel.id, 'You hugged yourself').catch(() => null) // Have the user hug themselves
      return null
    }
    // Define user
    let argz = args.join(' ')
    let user = msg.channel.guild.members.get(argz) || msg.channel.guild.members.find(member => member.username.toLowerCase().startsWith(argz.toLowerCase()) || (member.nick && member.nick.toLowerCase().startsWith(argz.toLowerCase()))) || msg.mentions[0]
    if (!user) { // If user is undefined
      bot.createMessage(msg.channel.id, 'User not found').catch(() => null) // Tell the user the user is not to be found
    } else if (user && user.id === bot.user.id) { // If user id matches the bots id
      bot.createMessage(msg.channel.id, `*Hugs ${msg.member.username} back.*`).catch(() => null) // Tell them the bot will hug them back
    } else { // If neither of those things...
      if (random === 'failed') { // If random is failed
        bot.createMessage(msg.channel.id, `${user.username}#${user.discriminator} Did not want to get hugged`).catch(() => null) // Tell them the user didnt want to be hugged
      } else if (random === 'succeeded') { // If the user succeeded in hugging the user
        bot.createMessage(msg.channel.id, `${msg.member.username}#${msg.member.discriminator} hugged ${user.mention}`).catch(() => null) // Have them hug the user
      }
    }
  }
})
