const {hiscores} = require("runescape-api/osrs");
const fs = require("fs");
const path = require("path");
const RSNList = require("../Players/RSNList.json");
const Discord = require("discord.js");
const logger = require("../Logs/Logger");
const db = require("../Data/DatabaseFunctions");

/**
 * Creates a new player JSON object in RSNList.json with the given player name
 * and message content. Uses the runescape-api/osrs which provides a
 * nicely structured JSON response when sent a request.
 * @param message
 * @param playerName
 * @returns {Promise<void>}
 */
async function createPlayer(message, playerName) {
    if (RSNList.hasOwnProperty(message.author.id)) {
        if (RSNList[message.author.id].authorRSN === playerName) {
            message.reply(`Your RSN is already set to ${playerName}`);
            return;
        }
    }
    let stats;
    try {
        message.channel.send(`Fetching information for ${playerName}...`);
        stats = await hiscores.getPlayer(String(playerName));
        // If the OSRS Hiscores is down
        if (isNaN(stats.skills.overall.rank)) {
            message.channel.send("Currently unavailable: https://secure.runescape.com/m=hiscore_oldschool/overall");
            logger.logErrors("### OSRS Hiscores is down ###");
            return;
        }
    } catch (e) {
        logger.logErrors(e);
        message.channel.send(`${playerName} does not appear on the hiscores.`);
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
    // Add RSN to datase
    await db.addToRSNList(message.author.id, playerName, stats.skills);

    message.reply(`Successfully set your RSN to ${playerName}`);
}

/**
 * Displays an embedded message with the users osrs character stats if
 * they have already set their rsn.
 * @param message
 * @param client
 */
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