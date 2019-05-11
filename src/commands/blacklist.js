const Blacklist = require('../models/blacklist');
const config = require('../../config')

async function add (id, type, client) {
    const types = { 0: 'Guild', 1: 'User' };
    const endType = types[Number(type)];
    if (!endType) {
        return 'ERROR - Invalid type'
    }
    const blacklisted = await Blacklist.findOne({ ID: id, type: endType }).exec();
    if (blacklisted && blacklisted.blacklisted === true) {
        return `\`${endType}\` \`${id}\` is already blacklisted!`
    }
    if (blacklisted) {
        const blacklist = await Blacklist.updateOne({ ID: id, type: endType }, { blacklisted: true }).exec();
        if (endType === 'Guild' && client.guilds.has(id)) {
            client.leaveGuild(id);
        }
        if (blacklist.blacklisted !== true) {
            return `Error blacklisting \`${endType}\`!`;
        }
        console.log(`COMMAND - BLACKLIST - Blacklisted a "${endType}" with ID of "${id}"`);
        return `Blacklisted \`${endType}\``;
    }
    const doc = new Blacklist({ ID: id, type: endType });
    doc.save();
    if (!doc) {
        return `Error blacklisting \`${endType}\``;
    }
    if (endType === 'Guild' && client.guilds.has(id)) {
        client.leaveGuild(id);
    }
    console.log(`COMMAND - BLACKLIST - Blacklisted a "${endType}" with ID of "${id}"`);
    return `Blacklisted a \`${endType}\` with id \`${id}\`!`;
}

async function remove (id, type) {
    const types = { 0: 'Guild', 1: 'User' };
    const endType = types[Number(type)];
    if (!endType) {
        return 'ERROR - Invalid type'
    }
    const blacklisted = await Blacklist.findOne({ ID: id, type: endType }).exec();
    if (!blacklisted || (blacklisted && blacklisted.blacklisted !== true)) {
        return `\`${endType}\` \`${id}\` is not blacklisted!`;
    }

    let blacklist = await Blacklist.deleteOne({ ID: id, type: endType }).exec();

    if (blacklist && blacklist.ok > 0) {
        console.log(`COMMAND - BLACKLIST - Removed blacklist for "${endType}" with ID of ""${id}"`)
        return `Removed blacklist for \`${endType}\` \`${id}\`!`
    }
}

async function check (id, type) {
    const types = { 0: 'Guild', 1: 'User' };
    const endType = types[Number(type)];
    if (!endType) {
        return 'ERROR - Invalid type'
    }
    const blacklisted = await Blacklist.findOne({ ID: id,
      type: endType }).exec();

    if (!blacklisted) {
        return `\`${endType}\` \`${id}\` is **not** blacklisted!`;
    }

    if (blacklisted.blacklisted) {
        return `\`${endType}\` \`${id}\` **is** blacklisted!`
    }
    return `\`${endType}\` \`${id}\` is **not** blacklisted!`
}

function invalidMessage (bot, msg) {
  return bot.createMessage(msg.channel.id, {
      embed: {
          title: 'Invalid Usage',
          description: 'Types: `0` - Guild, `1` - User\nSee sub commands and usage below!',
          fields: [
              {
                  name: 'Check',
                  value: `Check if a guild/user is blacklisted.\n**Usage:** ${msg.prefix}blacklist check [type] [ID]`
              },
              {
                  name: 'Add',
                  value: `Add a user/guild to the blacklist\n**Usage:** ${msg.prefix}blacklist add [type] [ID]`
              },
              {
                  name: 'Remove',
                  value: `Remove a user/guild from the blacklist\n**Usage:** ${msg.prefix}blacklist remove [type] [ID]`
              }
          ]
      }
  })
}

module.exports = bot => ({
    name: 'blacklist',
    run: async (msg, args) => {
        if (msg.author.id !== config.owner.id) {
            return;
        }
        if (!args[0]) {
            return invalidMessage(bot, msg)
        }
        switch (args[0]) {
          case 'add': {
              return bot.createMessage(msg.channel.id, await add(args[2], args[1], bot));
          } case 'check': {
              return bot.createMessage(msg.channel.id, await check(args[2], args[1]));
          } case 'remove': {
              return bot.createMessage(msg.channel.id, await remove(args[2], args[1]));
          } default: {
              return invalidMessage(bot, msg)
          }
        }
    },
    options: {
        description: 'Blacklist a guild or user',
        subcommands: [
            {
                label: 'add [type] [ID]',
                description: 'Add a type by ID to the blacklist.'
            },
            {
                label: 'check [type] [ID]',
                description: 'Check if id of type is blacklisted'
            },
            {
                label: 'remove [type] [ID]',
                description: 'Remove a type by id from the blacklist.'
            }
        ]
    }
})
