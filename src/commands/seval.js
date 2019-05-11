/* eslint-disable max-lines-per-function */
/* eslint-disable object-property-newline */
/* eslint-disable no-ternary */
/* eslint-disable multiline-ternary */
/* eslint-disable max-statements */
const { VM } = require('vm2')
const util = require('util')
const randomcolor = require('randomcolor')
const moment = require('moment')
const memberResolver = require('../functions/resolveMember');
const channelResolver = require('../functions/resolveChannel');
const guildResolver = require('../functions/resolveGuild');
const userResolver = require('../functions/resolveUser');

const checkBlacklist = require('../functions/checkForBlacklist')
const config = require('../../config')

const resolvers = {
  user: userResolver,
  member: memberResolver,
  guild: guildResolver,
  channel: channelResolver
}

function checker (args) {
  if (!args[0]) {
    return 'Error! Args required to run safe eval!'
  }
  if (args.join(' ').includes('require(')) {
    return 'Require does not work!'
  }
  if (args.join(' ').includes('createMessage')) {
    return 'No.'
  }
  if (args.join(' ').includes('shard')) {
    return 'GTFO'
  }
}

// eslint-disable-next-line max-lines-per-function
module.exports = bot => ({
  name: 'seval',
  run: async (msg, args) => {
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
    let check = checker(args);
    if (check) {
      return bot.createMessage(msg.channel.id, check)
    }
    try {
      const vm = new VM({
        sandbox: { moment, randomcolor, util, msg, resolvers }
      })
      let evaled = await vm.run(args.join(' '))
      switch (typeof evaled) {
        case 'object': {
          evaled = util.inspect(evaled, { depth: 0, showHidden: true })
          break
        }
        default: {
          evaled = String(evaled)
        }
      }
      if (!evaled) {
        return bot.createMessage(msg.channel.id, {
          embed: {
            title: 'Safe Eval Error',
            description: 'No output from Safe Eval!',
            color: Number('0x' + randomcolor({ hue: 'red', luminosity: 'bright' }).slice(1))
          }
        })
      }
      if (evaled.length > 2000) {
        evaled = evaled.match(/[\s\S]{1,1900}[\n\r]/g) || []

        if (evaled.length > 3) {
          bot.createMessage(msg.channel.id, `\`\`\`js\n${evaled[0]}\`\`\``).catch(() => { /* - */ })
          bot.createMessage(msg.channel.id, `\`\`\`js\n${evaled[1]}\`\`\``).catch(() => { /* - */ })
          bot.createMessage(msg.channel.id, `\`\`\`js\n${evaled[2]}\`\`\``).catch(() => { /* - */ })
        } else {
          evaled.forEach((message) => {
            bot.createMessage(msg.channel.id, `\`\`\`js\n${message}\`\`\``).catch(() => { /* - */ })
          })
        }
        return null
      }
      return bot.createMessage(msg.channel.id, `\`\`\`js\n${evaled}\`\`\``).catch(() => { /* - */ })
    } catch (err) {
        let file = {}
        let embed = {
          title: 'Safe Eval Error',
          description: `Error message: ${err.message ? err.message : err}`,
          color: Number('0x' + randomcolor({ hue: 'red', luminosity: 'bright' }).slice(1))
        }
        if (err.stack) {
          embed.fields = [
            {
              name: 'Error stack',
              value: `\`\`\`js\n${err.stack}\`\`\``
            }
          ]
          if (err.stack.length > 1024) {
            embed.fields = [];
            const buf = new Buffer.from(err.stack);
            embed.description += '\nError stack was too large. Check file for error stack!';
            file.file = buf;
            file.name = 'safe_eval_stack_error.txt';
          }
        }
        if (!file.file) {
          return bot.createMessage(msg.channel.id, { embed });
        }
        return bot.createMessage(msg.channel.id, { embed }, file);
    }
  },
  options: {
    description: 'Safely eval some JavaScript',
    usage: 'seval [code]',
    aliases: ['safeeval', 'se'],
    example: 'seval resolvers.user(msg.author.id)'
  }
})
