// Define stuff
const config = require('../config') // Require config
const screenshot = require('screenshot-desktop') // Require the library screenshot-desktop
const fs = require('fs')
// ESLint rule overrides

/* eslint no-plusplus: off */
/* eslint max-statements: ['error', 11] */

module.exports = bot => ({ // The command
  name: 'screenshot', // The command name
  run: async (msg) => { // What to run
    if (msg.author.id !== config.owner.id) return null // If msg author id does not equal config owner id
    await screenshot().then((img) => { // Takes a screenshot
      bot.createMessage(msg.channel.id, 'Here is your screenshot!', { file: img,
        name: 'screenshot.png' }).catch(() => null) // Creates a messgae with the with the screenshot
      if (fs.existsSync(img)) { // If the file exists (Why wouldn't it?)
        try { // Try
          fs.unlinkSync(img) // Deletes the file
        } catch (error) { // Catch any errors
          return null // Do nothing
        }
      }
    })
  }
})
