const request = require('superagent')

async function hi () {
    let r = await request.get('https://api.adviceslip.com/advice')
    r = JSON.parse(r.text)
    return r.slip.advice
}
module.exports = bot => ({
    name: 'advice',
    run: async (msg) => {
        let message = await bot.createMessage(msg.channel.id, ':loadingBars: Let me get you some advice!')
        let res = await hi();
        message.edit(res)
    },
    options: {
        description: 'Get some advice. Possibly bad advice'
    }
})
