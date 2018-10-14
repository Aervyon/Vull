const files = require('./files')

const helps = []

for (let file of files) { // Loop through the files
  let command = require(`./commands/${file}`) // Require the command
  console.log(file)
  if (command.help.usage) { // If command.help.usage is not undefined
    let halp = { name: command.name, // Define halp as a object
      type: command.help.type,
      desc: command.help.desc,
      fullDesc: command.help.fullDesc,
      usage: command.help.usage,
      example: command.help.example }
    helps.push(halp) // Push halp to helps
  } else {
    let halp = { name: command.name,
      type: command.help.type,
      desc: command.help.desc,
      fullDesc: command.help.fullDesc }
    helps.push(halp)
  }
}

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
