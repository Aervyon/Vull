const unban = {
  name: 'unban',
  type: 'admin',
  desc: 'Unbans a user',
  fullDesc: 'Unbans a user (requires ID)',
  usage: 'unban [member]',
  example: 'unban 323673862971588609'
}

const stop = {
  name: 'stop',
  type: 'owner',
  desc: 'Stops the bot',
  fullDesc: 'Stops the bot. The bot must be running on normal npm/node process.'
}

const set = {
  name: 'set',
  type: 'owner', // the type (everyone, owner, or admin)
  desc: 'Sets the bots name or avatar', // the description
  fullDesc: 'Sets the bots name or avatar, what else did you expect?', // the full description
  example: 'set name Screenshot botto', // the example usage
  usage: 'set [name/username/avatar] [new username/new avatar]' // what it should look like
}

const serverinfo = {
  name: 'serverinfo',
  type: 'everyone',
  desc: 'Gives you the guilds info',
  fullDesc: 'Gives you the a overview of the guilds info'
}

const server = {
  name: 'server',
  type: 'owner',
  desc: 'Adds a server to the database',
  fullDesc: 'Adds a server to the database (so it can use the prefix command and have custom prefixes)',
  usage: 'server [server ID]',
  example: 'server 483040770580807700'
}

const screenshot = {
  name: 'screenshot',
  desc: 'Takes a screenshot',
  fullDesc: 'Takes a screenshot of the owners computer.',
  type: 'owner'
}

const rolecolor = { // the rolecolor command
  name: 'rolecolor',
  desc: 'Edits a roles color',
  fullDesc: 'Edits a roles color, based on hue, hex (no # in front), or "random".',
  type: 'admin',
  usage: 'rolecolor [hue/random/hex] [role]',
  example: 'rolecolor orange halloween'
}

const randuser = {
  name: 'randuser',
  type: 'everyone',
  desc: 'Picks a random user',
  fullDesc: 'Picks a random user out of the server members that are not bots'
}

const randomcolor = {
  name: 'randomcolor',
  desc: 'Generates a random color',
  fullDesc: 'Generates a random color. Allows for user inputs to slightly alter the color',
  type: 'everyone',
  usage: 'randomcolor (hue/random)',
  example: 'randomcolor blue'
}

const prefix = {
  name: 'prefix',
  type: 'admin',
  usage: 'prefix [new prefix/--reset]',
  example: 'prefix s!',
  desc: 'Sets the guilds prefix',
  fullDesc: 'Sets a custom prefix for the guild, limit: one'
}

const ping = {
  name: 'ping',
  type: 'everyone', // the type (owner, everyone, or admin)
  desc: 'Pings the bot', // the description
  fullDesc: 'Pings the bot, shows the response time' // the full description
}

const nick = {
  name: 'nick',
  type: 'admin',
  desc: 'Sets the bots nickname',
  fullDesc: 'Sets my nickname or resets it',
  usage: 'nick [nickname/--reset]',
  example: 'nick Botto'
}

const kick = {
  name: 'kick',
  type: 'admin',
  desc: 'Kick someone',
  fullDesc: 'Kick someone from your server',
  usage: 'kick [member]',
  example: 'kick Null'
}

const isuser = {
  name: 'isuser',
  desc: 'Checks for user via the **REST API**',
  fullDesc: 'Checks for user by id via the **REST** api.',
  usage: 'isUser [id]',
  example: 'isUser 323673862971588609',
  type: 'everyone'
}

const hug = {
  name: 'hug',
  type: 'everyone',
  desc: 'Hug someone in your chat',
  fullDesc: 'Hug someone in your chat',
  usage: 'hug (member)',
  example: 'hug Botto'
}

const halp = {
  name: 'help',
  type: 'everyone',
  desc: 'This help command',
  fullDesc: 'This help command',
  example: 'help bot',
  usage: 'help (command-name)'
}

const changelog = {
  name: 'changelog',
  type: 'everyone',
  desc: 'Gives you the bots changelog',
  fullDesc: 'Gives you the bots changelog for the last 3 versions'
}

const bot = {
  name: 'bot',
  type: 'everyone',
  desc: 'Gives you the bots info',
  fullDesc: 'Gives you the bots information or how to get the bot',
  usage: 'bot (get)',
  example: 'bot'
}

const ban = {
  name: 'ban',
  type: 'admin',
  desc: 'Ban someone',
  fullDesc: 'Ban someone from your server',
  usage: 'ban [member]',
  example: 'ban Null'
}

const avatar = {
  name: 'avatar',
  desc: 'Gets a avatar',
  fullDesc: 'Gets a users avatar and shows it in a embed',
  type: 'everyone',
  usage: 'avatar (member)',
  example: 'avatar Null'
}

const helps = [
  set,
  stop,
  unban,
  serverinfo,
  server,
  screenshot,
  rolecolor,
  randuser,
  randomcolor,
  prefix,
  ping,
  nick,
  kick,
  isuser,
  hug,
  halp,
  changelog,
  bot,
  ban,
  avatar
]

const owner = [] // owner commands
const everyone = [] // everyone commands
const admin = [] // admin commands
const names = [] // The names of all of the commands

for (let help of helps) { // cycle through helps
  if (!help.type) {
    console.log('Missing help type for ' + help.name)
    process.exit()
  } else if (!help.desc) {
    console.log('Missing help desc for ' + help.name)
    process.exit()
  } else if (!help.fullDesc) {
    console.log('Missing help fullDesc for ' + help.name)
    process.exit()
  }
  if (help.type === 'admin') { // if help type is admin
    admin.push(`**${help.name}** - ${help.desc}`) // push help name and help desc to admin
    names.push(help.name)
  } else if (help.type === 'owner') { // if help type is owner
    owner.push(`**${help.name}** - ${help.desc}`) // push help name and help desc to owner
    names.push(help.name)
  } else if (help.type === 'everyone') { // / /if help type is everyone
    everyone.push(`**${help.name}** - ${help.desc}`) // push help name and help desc to everyone
    names.push(help.name)
  }
}

module.exports = {
  owner,
  admin,
  helps,
  everyone,
  names
}
