module.exports = bot => ({ // The command
  name: 'ping', // The command name
  run: (msg) => { // The part of the command wanted to run
    bot.createMessage(msg.channel.id, `Pong! \`${msg.channel.guild.shard.latency}\`ms`).catch(() => null) // Create a message, catching all errors
  }
})
