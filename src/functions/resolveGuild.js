const client = require('../bot');

function resolveGuild (arg) {
  if (!arg) {
    return null;
  }

  let guild = client.guilds.find(g => g.id === arg || g.name === arg || g.name.toLowerCase() === arg.toLowerCase() || g.name.includes(arg) || g.name.toLowerCase().includes(arg.toLowerCase()))

  return guild;
}

module.exports = resolveGuild;
