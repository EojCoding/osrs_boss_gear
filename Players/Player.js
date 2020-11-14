const {hiscores: player} = require("runescape-api/osrs");
const fs = require("fs");
const path = require("path");
const RSNList = require("../Players/RSNList.json");
const Discord = require("discord.js");
const logger = require("../Logs/Logger");

// Async function because it is necessary to get the proper information
async function createPlayer(message, playerName) {
    console.log(playerName);
    let stats;
    try {
        stats = await player.getPlayer(String(playerName));
    } catch (e) {
        logger.logErrors(e);
        message.channel.send("That player does not exist");
        return;
    }
    const authorID = message.author.id;
    let playerToAdd = {};

    // Set the discord ID as the key and the player name as the value
    // Then pick out the parts of the returned JSON that we want
    playerToAdd.authorRSN = playerName;
    playerToAdd.skills = stats.skills;

    RSNList[authorID] = playerToAdd;

    fs.writeFileSync(path.resolve(__dirname, "../Players/RSNList.json"), JSON.stringify(RSNList, null, "\t"));

    message.reply(`Successfully set your RSN to ${playerName}`);
}

function displayStats(message, client) {
    const id = message.author.id;
    const embedReply = new Discord.MessageEmbed();

    // If the message author hasn't set a RSN yet
    if (!RSNList.hasOwnProperty(id)) {
        return;
    }
    else {
        embedReply
            .setTitle("Total: " + RSNList[id].skills.overall.level)
            .setColor("0099ff")
            .setThumbnail("https://oldschool.runescape.wiki/images/b/bd/Stats_icon.png?1b467");
        for (const [key, value] of Object.entries(RSNList[id].skills)) {
            if (key !== "overall") {
                const skillEmoji = client.emojis.cache.find(emoji => emoji.name === "skill_"+key.toString());
                embedReply.addField(skillEmoji, value.level, true);
            }
        }
    }
    console.log("Sending reply");
    message.channel.send(embedReply);
}

function checkStatRequirements(authorid, boss) {

    return -1;
}

function getPlayer(id) {
    return RSNList[id];
}

module.exports = {
    createPlayer,
    displayStats,
    checkStatRequirements,
    getPlayer
}