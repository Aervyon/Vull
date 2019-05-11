/* eslint-disable max-statements */
const config = require('../../config');
const Guild = require('../models/guild');
const randomColor = require('randomcolor');
const checkBlacklist = require('../functions/checkForBlacklist');

const prefix = config.prefix || 'vull ';

function validPrefix (input) {
  const spaceReg = / $/;
  let backReg = /\\/
  if (backReg.test(input)) {
    return { bool: true,
      reason: 'Prefix contains backslash' }
  }
  if (spaceReg.test(input) && input.length > 6) {
    return { bool: true,
    reason: 'Prefix is too long, with space' }
  }
  if (!spaceReg.test(input) && input.length > 5) {
    return { bool: true,
      reason: 'Prefix is too long, without space' }
  }
  return { bool: false,
    reason: 'Prefix is perfect' }
}

// eslint-disable-next-line max-lines-per-function
module.exports = bot => ({
  name: 'prefix',
  run: async (msg, args) => {
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    const guild = await Guild.findOne({ ID: msg.channel.guild.id }).exec();
    if (!guild) {
      let doc = new Guild({ ID: msg.channel.guild.id,
        prefix })
        doc.save();
    }
    if (!args.length || !args[0]) {
      if (!guild) {
          return bot.createMessage(msg.channel.id, `The prefix for \`${msg.channel.guild.name}\` is: \`${prefix}\`\nYou can always mention me as well!`)
      }
      return bot.createMessage(msg.channel.id, `The prefix for \`${msg.channel.guild.name}\` is: \`${guild.prefix}\`\nYou can always mention me as well!`).catch(() => { /* - */ });
    }
    if (!msg.member.permission.has('administrator' || 'manageGuild') && msg.member.id !== config.owner.id && msg.member.id !== msg.channel.guild.ownerID) {
      return null;
    }
    let pfx = args.join(' ').replace(/{space}$/, ' ');
    let valid = validPrefix(pfx)
    if (valid.bool === true) {
      return bot.createMessage(msg.channel.id, {
        embed: {
          title: 'Invalid Prefix',
          fields: [
            {
              name: 'Not allowed',
              value: 'Length > 5 with no space at the end is not allowed\nAny prefix with a backslash (`\\`) is not allowed'
            },
            {
              name: 'Reason',
              value: valid.reason
            }
          ],
          color: Number('0x' + randomColor({ hue: 'red' }).slice(1))
        }
      });
    }
    Guild.updateOne({ ID: msg.channel.guild.id }, { $set: { prefix: pfx } }).exec();
    guild.save();
    bot.registerGuildPrefix(msg.channel.guild.id, [
      '@mention ',
      pfx
    ])
    bot.createMessage(msg.channel.id, `Updated your guild prefix to ${pfx}`)
  },
  options: {
    description: 'Change the guilds prefix',
    usage: 'prefix (prefix)\nAppend `{space}` to the end of the prefix to add a space!',
    limitedto: 'Server Managers+'
  }
})
