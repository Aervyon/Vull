/* eslint-disable multiline-ternary */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */


/* ---- TAKEN FROM AXONTEAM/NUCLEUS ---- */

const Guild = require('../models/guild');
const config = require('../../config');
const randomColor = require('randomcolor');
const checkBlacklist = require('../functions/checkForBlacklist')

const util = require('util');
const sleep = util.promisify(setTimeout);

module.exports = bot => ({
    name: 'help',
    // eslint-disable-next-line max-lines-per-function
    run: async (msg, args) => {
        let blacklisted = await checkBlacklist('User', msg.author.id);
        if (blacklisted && msg.author.id !== config.owner.id) {
            return;
        }
        const guild = await Guild.findOne({ ID: msg.channel.guild.id }).exec();
        let prefix = guild.prefix || config.prefix || 'vull '
        let pfx = msg.prefix
        if (msg.prefix.match(`${bot.user.id}`)) {
            pfx = prefix;
        }
        if (!args[0]) {
            let desc;
            for (let command in bot.commands) {
                command = bot.commands[command];
                if (!desc) {
                    let txt = `\`${pfx}${command.label}\` - **${command.description}**`
                    desc = txt
                } else {
                    let txt = `\n\`${pfx}${command.label}\` - **${command.description}**`
                    desc += txt;
                }
            }
            const channel = await bot.getDMChannel(msg.author.id);
            const mess = await bot.createMessage(msg.channel.id, 'Check your DMs!');
            const message = {
                embed: { title: 'Help',
                  description: desc,
                  color: Number('0x' + randomColor().slice(1)) }
            };
            bot.createMessage(channel.id, message);
            await sleep(5000);
            mess.delete();
            msg.delete().catch(() => {
                // Ignore this error
            })
            return;
        }
        if (!bot.commands[args[0].toLowerCase()]) {
            return bot.createMessage(msg.channel.id, `Command not found! Use \`${pfx}help\` to see a list of commands!`);
        }
        const command = bot.commands[args[0].toLowerCase()];
        const fields = [];
        const mess = {
            title: `Help for ${pfx}${command.label}`,
            description: `**Name:** ${command.label}`,
            color: Number('0x' + randomColor().slice(1))
        }
        if (command.description) {
            mess.description += `\n**Description:** ${command.description}`;
        }
        if (command.usage) {
            mess.description += `\n**Usage:** \`${pfx}${command.usage}\``;
        }
        if (command.options.limitedto) {
            mess.description += `\n**Limited to:** ${command.options.limitedto}`
        }
        if (command.aliases.length > 0) {
            let aliases = []
            for (let alias of command.aliases) {
                aliases.push(`\`${alias}\``)
            }
            // eslint-disable-next-line no-ternary
            fields.push({ name: aliases.length > 1 ? 'Aliases' : 'Alias',
            value: aliases.join(', ') })
        }
        if (command.options.subcommands.length > 0) {
            const finale = { name: 'Subcommands',
value: [] };
            for (let subcmd of command.options.subcommands) {
                const cur = `\`${pfx}${command.label} ${subcmd.label}\` - ${subcmd.description}`;
                finale.value.push(cur);
            }
            finale.value = finale.value.join('\n');
            fields.push(finale);
        }
        if (fields.length > 0) {
            mess.fields = fields;
        }
        return bot.createMessage(msg.channel.id, {
            embed: mess
        });
    },
    options: {
        description: 'This help text',
        usage: 'help (command)'
    }
})
