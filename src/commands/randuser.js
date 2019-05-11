const config = require('../../config');
const checkBlacklist = require('../functions/checkForBlacklist')

module.exports = bot => ({
  name: 'randuser',
  run: async (msg) => {
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    let randuser = msg.channel.guild.members.find(user => !user.bot) // Get the user
    // eslint-disable-next-line dot-notation
    return bot.commands['userinfo'].execute(msg, randuser.id)
  },
  options: {
    description: 'Find a random user in the server and display their info'
  }
})
