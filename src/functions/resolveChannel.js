function resolveChannel (guild, arg) {

  if (!guild || !arg) {
    return null;
  }

  let channel = guild.channels.find(chan => chan.id === arg || chan.id === arg.replace(/<#|>/g, '') || chan.name === arg.toLowerCase());

  return channel;
}

module.exports = resolveChannel;
