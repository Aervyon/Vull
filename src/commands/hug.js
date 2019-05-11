const config = require('../../config');
const checkBlacklist = require('../functions/checkForBlacklist');

// Eslint rule overrides

/* eslint no-lonely-if: off */
/* eslint max-statements: [ 'error', 16 ] */
/* eslint no-extra-parens: off */
/* eslint consistent-return: off */

module.exports = bot => ({
  name: 'hug', // Name of the command
  run: async (msg, args) => { // What to run
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    // A random chance
    let work = [
      'failed',
      'succeeded'
    ]

    let rand = Math.round(Math.random() * work.length)
    let random = work[rand]

    if (!args[0] || args.join(' ') === ' ') { // If there are no args to the message
      bot.createMessage(msg.channel.id, 'You hugged yourself').catch(() => { /* - */ }) // Have the user hug themselves
      return null
    }
    // Define user
    let argz = args.join(' ')
    let user = msg.channel.guild.members.get(argz) || msg.channel.guild.members.find(member => member.username.toLowerCase().startsWith(argz.toLowerCase()) || (member.nick && member.nick.toLowerCase().startsWith(argz.toLowerCase()))) || msg.mentions[0]
    if (!user) { // If user is undefined
      bot.createMessage(msg.channel.id, 'User not found').catch(() => { /* - */ }) // Tell the user the user is not to be found
    } else if (user && user.id === bot.user.id) { // If user id matches the bots id
      bot.createMessage(msg.channel.id, `*Hugs ${msg.member.username} back.*`).catch(() => { /* - */ }) // Tell them the bot will hug them back
    } else { // If neither of those things...
      if (user.id === msg.member.id) {
        return bot.createMessage(msg.channel.id, 'You hugged yourself')
      }
      if (random === 'failed') { // If random is failed
        bot.createMessage(msg.channel.id, `${user.username}#${user.discriminator} Did not want to get hugged`).catch(() => { /* - */ }) // Tell them the user didnt want to be hugged
      } else if (random === 'succeeded') { // If the user succeeded in hugging the user
        bot.createMessage(msg.channel.id, `${msg.member.username}#${msg.member.discriminator} hugged ${user.mention}`).catch(() => { /* - */ }) // Have them hug the user
      }
    }
  },
  options: {
    description: 'Hug someone',
    usage: 'hug (user)'
  }
})
