/* eslint-disable multiline-ternary */
const config = require('../../config.json')
const { promisify } = require('util')
const { exec } = require('child_process')
const aExec = promisify(exec)

async function execute (command) {
    let execution
    try {
        execution = await aExec(command)
    } catch (err) {
        // eslint-disable-next-line no-ternary
        return `An error has occurred! See below\n\`\`\`js\n${err.message ? err.message : err }\`\`\``
    }
    return `\`\`\`sh\n${execution.stdout}\`\`\``
}

module.exports = bot => ({
    name: 'exec',
    // eslint-disable-next-line max-statements
    run: async (msg, args) => {
        if (config.owner.id !== msg.author.id) {
            return;
        }
        if (!args[0]) {
            return bot.createMessage(msg.channel.id, 'Invalid usage, Supply a command to execute!')
        }
        const message = await bot.createMessage(msg.channel.id, `Running command \`${args.join(' ')}\``)
        let exc = await execute(args.join(' '))
        message.edit(`Output for \`${args.join(' ')}\``)
        if (exec.length > 2000) {
            let out = exc.substring(0, 1994)
            out = `${out}\`\`\``
            return bot.createMessage(msg.channel.id, out)
        }
        bot.createMessage(msg.channel.id, exc)
    },
    options: {
        description: 'Execute a terminal command',
        usage: 'exec [command]',
        example: 'exec pm2 ls',
        aliases: ['execute'],
        limitedto: 'Bot Owner'
    }
})
