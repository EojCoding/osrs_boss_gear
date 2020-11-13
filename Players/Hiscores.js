// API provided by: https://github.com/maxswa/osrs-json-hiscores
const {hiscores} = require("runescape-api/osrs");
const fs = require("fs");
const path = require("path");
const RSNList = require("../Players/RSNList.json");

// Async function because it is necessary to get the proper information
async function createPlayer(message, args) {
    let playerName = args.join(" ");
    console.log(playerName);
    const stats = await hiscores.getPlayer(String(playerName));
    const authorID = message.author.id;
    let playerToAdd = {};

    // Set the discord ID as the key and the player name as the value
    // Then pick out the parts of the returned JSON that we want
    playerToAdd.authorID = playerName;
    playerToAdd.skills = stats.skills;

    RSNList[authorID] = playerToAdd;

    fs.writeFileSync(path.resolve(__dirname, "../Players/RSNList.json"), JSON.stringify(RSNList, null, "\t"));
}

module.exports = {
    createPlayer
}