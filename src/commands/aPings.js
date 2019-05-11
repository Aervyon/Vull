const Guild = require('../models/guild');
const config = require('../../config');

const resolver = require('../functions/resolveMember')

async function set (guildID, status, channelID, msgChannel) {
    const guild = await Guild.findOne({ ID: guildID }).exec();

    const statuses = ['disabled', 'enabled']
    if (!statuses.includes(status)) {
        return 'Invalid status! Statuses allowed: `disabled` or `enabled`'
    }

    let { channel, users, cooldownUsers } = guild.adventure;
    channel = channelID || channel || msgChannel;

    await Guild.findOneAndUpdate({ ID: guildID }, { $set: { adventure: { users, channel, status, cooldownUsers } } }).exec()

    let out = await show(guildID);
    return out;
}

async function show (guildID) {
    const guild = await Guild.findOne({ ID: guildID }).exec();

    return { embed: {
            title: 'apings Settings',
            description: `**Status**: \`${guild.adventure.status}\`\n**Channel**: \`${guild.adventure.channel || 'No channel provided'}\``
        }
    }
}

async function add (guildID, userMention) {
    const guild = await Guild.findOne({ ID: guildID }).exec();

    const { status, channel, cooldownUsers } = guild.adventure;

    if (guild.adventure.users.includes(userMention)) {
        let str = 'You are already subscribed!';
        if (status === 'disabled' || !channel) {
            str =+ '\n**NOTICE:** aPings are not setup here!'
        }
        return str;
    }

    const users = guild.adventure.users.concat([ userMention ]);

    await Guild.findOneAndUpdate({ ID: guildID }, { $set: { adventure: { users, channel, status, cooldownUsers } } }).exec()

    let str = 'Subscribed you to adventure pings!';
    if (status === 'disabled' || !channel) {
        str =+ '\n**NOTICE:** aPings are not setup here!'
    }

    return str;
}

async function remove (guildID, user) {
    const guild = await Guild.findOne({ ID: guildID }).exec();

    const { status, channel, cooldownUsers } = guild.adventure;

    userMention = user.mention

    if (!guild.adventure.users.includes(userMention)) {
        return `${user.user.username}#${user.user.discriminator} is not subscribed to adventure pings!`
    }

    const users = guild.adventure.users.filter(mention => mention !== userMention);

    await Guild.findOneAndUpdate({ ID: guildID }, { $set: { adventure: { users, channel, status, cooldownUsers } } }).exec()

    return `Unsubscribed ${user.user.username}#${user.user.discriminator} from adventure pings!`;
}

async function list (guildID) {
    const guild = await Guild.findOne({ ID: guildID }).exec();

    let { users } = guild.adventure;

    users = users || []

    let out = {
        embed: {
            title: 'List of users subscribed to adventure pings',
            description: users.join('\n')
        }
    }

    if (!users) {
        out = 'No users subscribed'
    }

    return out;
}

async function cooldownsAdd (guildID, userMention) {
    const guild = await Guild.findOne({ ID: guildID }).exec();

    let { cooldownUsers, users, status, channel } = guild.adventure;
    cooldownUsers = cooldownUsers || [];
    if (cooldownUsers.includes(userMention)) {
        let errStr = 'You are already subscribed to cooldowns!';
        if (status === 'disabled' || !channel) {
            errStr += '\n**NOTICE:** aPings are not set up here!'
        }
        return errStr
    }

    cooldownUsers = cooldownUsers.concat([ userMention ]);

    await Guild.findOneAndUpdate({ ID: guildID }, { $set: { adventure: { users, channel, status, cooldownUsers } } }).exec();

    let str = 'Subscribed you to cooldowns!';
        if (status === 'disabled' || !channel) {
            str += '\n**NOTICE:** aPings are not set up here!'
        }
    return str
}

async function cooldownsRemove (guildID, user) {
    const guild = await Guild.findOne({ ID: guildID }).exec();
    const userMention = user.mention

    let { cooldownUsers, users, status, channel } = guild.adventure;
    cooldownUsers = cooldownUsers || [];
    if (!cooldownUsers.includes(userMention)) {
        return `${user.user.username}#${user.user.discriminator} is not subscribed to cooldowns!`
    }

    cooldownUsers = cooldownUsers.filter(mention => mention !== userMention);

    await Guild.findOneAndUpdate({ ID: guildID }, { $set: { adventure: { users, channel, status, cooldownUsers } } }).exec();

    return `Unsubsribed ${user.user.username}#${user.user.discriminator} from the cooldown list!`
}

async function cooldownsList (guildID) {
    const guild = await Guild.findOne({ ID: guildID }).exec();

    const { cooldownUsers } = guild.adventure;

    let users = cooldownUsers || []

    let out = {
        embed: {
            title: 'List of users subscribed to cooldown pings',
            description: users.join('\n')
        }
    }

    if (!users) {
        out = 'No users subscribed for cooldowns!'
    }

    return out;
}

module.exports = bot => ({
    name: 'apings',
    run: async (msg, args) => {
        if (!args[0]) {
            return bot.commands['help'].execute(msg, [ 'apings' ])
        }
        if (args[0] === 'set') {
            if (!msg.member.permission.has('administrator' || 'manageGuild') && msg.member.id !== msg.channel.guild.ownerID && msg.member.id !== config.owner.id) {
                return msg.channel.createMessage('You have not the permission to use this. Contact a server admin.');
            }
            if (!args[1]) {
                return bot.commands['help'].execute(msg, [ 'apings' ])
            }
            const output = await set(msg.channel.guild.id, args[1], args[2], msg.channel.id);
            msg.channel.createMessage(output);
        } else if (args[0] === 'add') {
            const output = await add(msg.channel.guild.id, msg.member.mention);
            msg.channel.createMessage(output);
        } else if (args[0] === 'remove') {
            if (args[1]) {
                if (!msg.member.permission.has('administrator' || 'manageGuild') && msg.member.id !== msg.channel.guild.ownerID && msg.member.id !== config.owner.id) {
                    return msg.channel.createMessage('You have not the permission to use this. Contact a server admin.');
                }

                const mem = resolver(msg.channel.guild, args[1]);
                if (!mem) {
                    return msg.channel.createMessage('User not found!')
                }

                const output = await remove(msg.channel.guild.id, mem);
                return msg.channel.createMessage(output);
            }
            const output = await remove(msg.channel.guild.id, msg.member);
            msg.channel.createMessage(output);
        } else if (args[0] === 'show') {
            const output = await show(msg.channel.guild.id);
            msg.channel.createMessage(output);
        } else if (args[0] === 'list') {
            const output = await list(msg.channel.guild.id);
            msg.channel.createMessage(output).catch(() => { /* - */ })
        } else if (args.slice(0, 2).join(' ') === 'cooldowns add') {
            const output = await cooldownsAdd(msg.channel.guild.id, msg.member.mention);
            msg.channel.createMessage(output)
        } else if (args.slice(0, 2).join(' ') === 'cooldowns remove') {
            if (args[2]) {
                if (!msg.member.permission.has('administrator' || 'manageGuild') && msg.member.id !== msg.channel.guild.ownerID && msg.member.id !== config.owner.id) {
                    return msg.channel.createMessage('You have not the permission to use this. Contact a server admin.');
                }

                const mem = resolver(msg.channel.guild, args[2]);
                if (!mem) {
                    return msg.channel.createMessage('User not found!')
                }

                const output = await cooldownsRemove(msg.channel.guild.id, mem);
                return msg.channel.createMessage(output);
            }
            const output = await cooldownsRemove(msg.channel.guild.id, msg.member);
            msg.channel.createMessage(output);
        } else if (args.slice(0, 2).join(' ') === 'cooldowns list') {
            const output = await cooldownsList(msg.channel.guild.id);
            msg.channel.createMessage(output)
        } else {
            msg.channel.createMessage('Invalid usage! See below');
            return bot.commands['help'].execute(msg, [ 'apings' ])
        }
    },
    options: {
        description: 'Settings for listening to cat#3890\'s adventure messages',
        subcommands: [
            {
                label: 'set [status] (channel)',
                description: 'Set settings for apings'
            },
            {
                label: 'show',
                description: 'Show apings settings'
            },
            {
                label: 'add',
                description: 'Subscribe to apings'
            },
            {
                label: 'remove (user)',
                description: 'Unsubscribe to apings (If you are unsubscribing a user you must be a manager)'
            },
            {
                label: 'list',
                description: 'List subscribed users'
            },
            {
                label: 'cooldowns add',
                description: 'Subscribe to cool down pings'
            },
            {
                label: 'cooldowns remove (user)',
                description: 'Unsubscribe to cool down pings (If you are unsubscribing a user you must be a manager)'
            },
            {
                label: 'cooldowns list',
                description: 'List users subscribed to cooldowns'
            }
        ]
    }
})