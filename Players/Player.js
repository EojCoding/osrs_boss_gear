const {hiscores} = require("runescape-api/osrs");
const Discord = require("discord.js");
const logger = require("../Logs/Logger");
const db = require("../Data/DatabaseFunctions");

/**
 * Creates a new player JSON object in RSNList.json with the given player name
 * and message content. Uses the runescape-api/osrs which provides a
 * nicely structured JSON response when sent a request.
 * @param message The discord message object
 * @param playerName The in-game osrs name of the user.
 * @returns {Promise<void>}
 */
async function createPlayer(message, playerName) {
    let stats;
    try {
        message.channel.send(`Fetching information for ${playerName}...`);
        stats = await hiscores.getPlayer(String(playerName));
        // If the OSRS Hiscores is down
        if (isNaN(stats.skills.overall.rank)) {
            logger.logErrors("### OSRS Hiscores is down ###");
            return message.channel.send("Currently unavailable: https://secure.runescape.com/m=hiscore_oldschool/overall");
        }
        // Returns true if it was added to mongo
        else if (await db.addToRSNList(message.author.id, playerName, stats.skills)) {
            message.reply(`updated your RSN: ${playerName}`);
        }
        else {
            message.reply("couldn't update your RSN.");
        }
    } catch (e) {
        // This gets logged if a 404 is returned from the above API Call to hiscores
        logger.logErrors(e);
        return message.channel.send(`${playerName} does not appear on the hiscores.`);
    }
}

/**
 * Displays an embedded message with the users osrs character stats if
 * they have already set their rsn.
 * @param message The discord message object
 * @param client The bot client
 */
async function displayStats(message, client) {
    const embedReply = new Discord.MessageEmbed();
    const playerJSON = await db.displayStats(message.author.id); // Get the player from mongo

    if (playerJSON === -1) { // If it doesn't exist it returns -1.
        return message.reply("you should set your RSN first.");
    }
    else {
        delete playerJSON._id; // Don't need the _id property
        embedReply
            .setTitle("Total: " + playerJSON.skills.overall.level)
            .setColor("0099ff")
            .setThumbnail("https://oldschool.runescape.wiki/images/b/bd/Stats_icon.png?1b467");
        delete playerJSON.skills.overall; // Don't need this property anymore
        // Look at each skill and get the level from it, also assign the appropriate emoji to it
        for (const key in playerJSON.skills) {
            const skillEmoji = client.emojis.cache.find(emoji => emoji.name === "skill_" + key.toString());
            embedReply.addField(skillEmoji, playerJSON.skills[key].level, true);
        }
    }
    await message.channel.send(embedReply);
}

module.exports = {
    createPlayer,
    displayStats,
}