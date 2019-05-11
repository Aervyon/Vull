const client = require('../bot');

function resolveUser (arg) {
  if (!arg) {
    return null
  }

  const user = client.users.find(uzer => uzer.id === arg.replace('!', '').replace(/<@|>/g, '') || uzer.username.toLowerCase().startsWith(arg.toLowerCase()) || uzer.username.toLowerCase() === arg.toLowerCase() || `${uzer.username.toLowerCase()}#${uzer.discriminator}` === arg.toLowerCase())

  return user;

}

module.exports = resolveUser;
