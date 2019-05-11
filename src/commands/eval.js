
const config = require('../../config')
const { inspect } = require('util')

/* eslint-disable array-element-newline */
// eslint-disable-next-line max-lines-per-function
module.exports = bot => ({
    name: 'eval',
    run: async (msg, args) => {
        if (msg.author.id !== config.owner.id) return;
        let noOut;
        if (!args[0]) {
            return msg.channel.createMessage('No arguments supplied, please supply me with some code. Just a notice, if you are not familiar with node.js and javascript.... Please for your own saftey, do not use this command').catch(() => { return; })
        }
        if (args[0] === 'no-out') {
            args = args.slice(1);
            noOut = true;
        }
        try { /* eslint-disable */
            let evaled = await eval(args.join(' '))
            switch (typeof evaled) {
                case 'object': {
                    evaled = inspect(evaled, { depth: 0, showHidden: true })
                    break;
                }
                default: {
                    evaled = String(evaled)
                }
            } /* eslint-enable */

            if (noOut) return;

            if (evaled.length === 0 || !evaled) return msg.channel.createMessage('No output!');

            evaled = evaled.split(bot.token).join('NO TOKEN');

            if (evaled.length > 2000) {
                evaled = evaled.match(/[\s\S]{1,1900}[\n\r]/g) || [];
                try {
                    if (evaled.length >= 3) {
                        msg.channel.createMessage(`\`\`\`js\n${evaled[0]}\`\`\``);
                        msg.channel.createMessage(`\`\`\`js\n${evaled[1]}\`\`\``);
                        msg.channel.createMessage(`\`\`\`js\n${evaled[2]}\`\`\``);
                    } else {
                        evaled.forEach((message) => {
                            msg.channel.createMessage(`\`\`\`js\n${message}\`\`\``);
                        })
                    }
                    return;
                } catch (err) {
                    console.log('Something happened! See below');
                    console.error(err);
                }
            }
            msg.channel.createMessage(`\`\`\`js\n${evaled}\`\`\``).catch(() => { return; })
        } catch (err) {
            msg.channel.createMessage(`An error occured! Check your logs! \nMessage: \`\`\`js\n${err.message}\`\`\``).catch(() => { /* - */ })
            console.log(err.stack)
        }
    },
    options: {
        description: 'Execute some javascript',
        usage: 'eval [code]',
        limitedto: 'Owner',
        aliases: ['e', 'evaluate'],
        subcommands: [
            {
                label: 'no-out [code]',
                description: 'Evals code but does not send any output'
            }
        ]
    }
})
