const randomColor = require('randomcolor') // Require randomcolor

module.exports = bot => ({ // The entire command
  name: 'changelog', // The command name
  run: (msg) => { // What the command does
    bot.createMessage(msg.channel.id, { // Create a message
      embed: { // Create a embed
        title: 'Changelog', // Embed title
        color: Number('0x' + randomColor({ hue: 'orange' }).slice(1)), // The color of the embed
        description: 'Working on V1.0.0 - Add comments to code, make the bot ready to self host.', // The description of the embed
        fields: [ // The embed fields (array)
          {
            name: 'V0.9.9',
            value: 'Added a bunch more commands'
          },
          { // The first field object
            name: 'V0.9.8', // The name of this field object
            value: 'Added a database, autoresponders, some commands (incluing prefix and server)' // The value of this field object
          }, // End a the first object
          { // Second embed object
            name: 'V0.9.3', // The name
            value: 'Updated bot command, updated randuser, and added server' // The value
          } // End of embed object
        ], // End of fields array
        timestamp: new Date() // The timestamp for the embed
      }
    }).catch(() => null) // Catch and createMessage errors.
  },
  help: {
    type: 'everyone',
    desc: 'Gives you the bots changelog',
    fullDesc: 'Gives you the bots changelog for the last 3 versions'
  }
})
