/* eslint max-statements: off */
/* eslint max-lines-per-function: off */

const resolver = require('../functions/resolveChannel');
const config = require('../../config');
const checkBlacklist = require('../functions/checkForBlacklist')

module.exports = bot => ({
  name: 'say',
  run: async (msg, args) => {
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    if (!msg.member.permission.has('manageGuild' || 'administrator') && msg.author.id !== msg.channel.guild.ownerID) {
      return null;
    }
    msg.delete().catch(() => { /* - */ })
    if (args[0] === 'channel') {
      let channel = resolver(msg.channel.guild, args[1]);
      if (!channel) {
        return bot.createMessage(msg.channel.id, 'Error! No channel found!');
      }
      if (!args[2]) {
        return bot.createMessage(msg.channel.id, 'Error! No message found');
      }
      return bot.createMessage(channel.id, args.slice(2).join(' '));
    }
    if (!args[0]) {
      return bot.createMessage(msg.channel.id, 'Error! No message found!');
    }
    return bot.createMessage(msg.channel.id, args.join(' '));
  },
  options: {
    description: 'Make the bot say something',
    usage: 'say [text]',
    limitedto: 'Server Administrators/Managers',
    subcommands: [
      {
        label: 'channel [channel] [text]',
        description: 'Make the bot say something in a different channel'
      }
    ]
  }
})
