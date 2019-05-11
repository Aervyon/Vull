/* eslint-disable max-statements */
/* eslint-disable no-ternary */
const randomColor = require('randomcolor');
const config = require('../../config');
const checkBlacklist = require('../functions/checkForBlacklist');

/* eslint max-statements: [error, 14] */
/* eslint max-lines-per-function: ['error', 70] */

let hueArr = [
  'red',
  'blue',
  'green',
  'pink',
  'orange',
  'yellow',
  'purple',
  'random'
]

module.exports = bot => ({
  name: 'randomcolor', // The command name
  run: async (msg, args) => { // The part of the command wanted to run
    let blacklisted = await checkBlacklist('User', msg.author.id);
    if (blacklisted && msg.author.id !== config.owner.id) {
        return;
    }
      let color = randomColor({
        luminosity: 'random',
        hue: 'random'
      });
      if (!args[0] || (args[0] && args[0] !== 'attractive')) {
        return bot.createMessage(msg.channel.id, {
          embed: {
            title: 'RandomColor',
            color: Number('0x' + color.slice(1)),
            fields: [
              { name: 'Hex',
            value: color }
            ]
          }
        })
      }
      color = randomColor();
      return bot.createMessage(msg.channel.id, {
        embed: {
          title: 'RandomColor',
          color: Number('0x' + color.slice(1)),
          fields: [
            { name: 'Hex',
          value: color }
          ]
        }
      })
  },
  options: {
    description: 'Generate a random color'
  }
})
