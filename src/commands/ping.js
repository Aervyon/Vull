function getPing (base) {
  let date = `${new Date() - base}`;

  if (Number(date) > 300000) {
    return `\`Over 5 minutes (${date})\`ms`
  }
  return `\`${date}\`ms`
}

module.exports = bot => ({ // The command
  name: 'ping', // The command name
  run: async (msg) => { // The part of the command wanted to run
    const date = new Date()

    const mess = await bot.createMessage(msg.channel.id, 'Pong!')

    if (!mess) {
      return null;
    }

    mess.edit(`Pong! ${getPing(date)}`)
  },
  options: {
    description: 'Ping the bot'
  }
})
