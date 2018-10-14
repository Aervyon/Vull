const fs = require('fs') // Require fs
const path = require('path') // Define path

function getFiles (directory) {
  let files = fs.readdirSync(directory).map(name => path.join(directory, name)).filter(isFile)
  for (let file in files) {
    files[file] = files[file].slice(directory.length + 1)
  }
  return files
}

function isFile (source) {
  return fs.lstatSync(source).isFile()
}

let files = getFiles('commands') // Get the commands

module.exports = files // Export the files
