function resolve (guild, arg) {

  if (!arg || !guild || guild.avaliable) {
    return null;
  }

  let user = guild.members.find(mem => mem.id === arg.replace('!', '').replace(/<@|>/g, '') || mem.user.username.toLowerCase().startsWith(arg.toLowerCase()) || mem.user.username.toLowerCase() === arg.toLowerCase() || `${mem.user.username.toLowerCase()}#${mem.user.discriminator}` === arg.toLowerCase() || (mem.nick && mem.nick.toLowerCase().startsWith(arg)) || (mem.nick && mem.nick.toLowerCase() === arg.toLowerCase()))

  return user;
}

module.exports = resolve;
