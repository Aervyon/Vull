module.exports = bot => ({ // The entire command
  name: 'changelog', // The command name
  run: (msg) => { // What the command does
    bot.createMessage(msg.channel.id, 'You can view the commits here: https://github.com/VoidNulll/Vull/commits/rewrite')
  },
  options: {
    description: 'Sends the bots commit link'
  }
})
