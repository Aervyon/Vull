const Blacklist = require('../models/blacklist');

async function checkIfBlacklist (type, id) {
    const blackliste = await Blacklist.findOne({ type,
      ID: id,
      blacklisted: true }).exec();

    if (!blackliste) {
        return false;
    }

    return true;
}

module.exports = checkIfBlacklist;
