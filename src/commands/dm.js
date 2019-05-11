const resolver = require('../functions/resolveMember');
const randomColor = require('randomcolor');
const config = require('../../config');
const checkBlacklist = require('../functions/checkForBlacklist')
/* eslint max-statements: ['error', 20] */
module.exports = bot => ({
  name: 'dm',
  run: async (msg, args) => {
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    let mess;
    if (!msg.member.permission.has('manageGuild' || 'administrator') && msg.member.id !== config.owner.id) {
      return null;
    }
    const authorChannel = await bot.getDMChannel(msg.author.id);
    try {
      await msg.delete()
    } catch {
        authorChannel.createMessage('I was unable to delete the command message!');
    }
    if (!args[0] || !args[1]) {
      return bot.createMessage(msg.channel.id, `Invalid usage!\nUsage: \`${msg.prefix}dm [user] [message]\`\nYou are missing one of those arguments!`).catch(() => { /* - */ })
    }
    let user = resolver(msg.channel.guild, args[0])
    if (!user) {
      return bot.createMessage(msg.channel.id, 'Invalid user!').catch(() => { /* - */ });
    }

    const userChannel = await bot.getDMChannel(user.id);

    try {
      await bot.createMessage(userChannel.id, `From ${msg.channel.guild.name}: ${args.slice(1).join(' ')}`);
      mess = `Succesfully DM'd ${user.username}`;
    } catch (err) {
      mess = {
        embed: {
          title: 'Error!',
          description: 'I am unable to DM that user! They may have their direct messages locked, have me blocked, or they might be a bot (Bots cant DM bots)',
          color: Number('0x' + randomColor({ hue: 'red' }).slice(1))
        }
      }
    }
    bot.createMessage(authorChannel.id, mess).catch(() => { /* - */ })
  },
  options: {
    description: 'DM a user',
    usage: 'dm [user]',
    limitedto: 'Server Admins/Managers'
  }
})
