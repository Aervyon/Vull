const { promisify } = require('util')
const sleep = promisify(setTimeout)

module.exports = bot => ({
  name: 'get',
  run: async (msg) => {
    let dmChan = await bot.getDMChannel(msg.author.id)
    let message = await bot.createMessage(msg.channel.id, 'Check your DMs!').catch(() => { /* -- */ })
    if (message) {
      await sleep(5000);
      message.delete().catch(() => { /* -- */ })
    }
    msg.delete().catch(() => { /* -- */ })
    bot.createMessage(dmChan.id, {
      embed: {
        title: 'Thanks for showing interest in Vull!',
        fields: [
          {
            name: 'Selfhost link (no support):',
            value: 'https://github.com/VoidNulll/Vull/tree/rewrite'
          },
          {
            name: 'Public bot',
            value: 'https://discordapp.com/api/oauth2/authorize?client_id=471038759362887680&permissions=469780518&scope=bot'
          }
        ]
      }
    })
  },
  options: {
    description: 'Sends you the repository and public bot invite link',
    aliases: ['add']
  }
})
