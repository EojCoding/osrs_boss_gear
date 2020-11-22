/**
 * This command ~help will display a list of available commands
 */

// Export JSON
module.exports = {
    name : "help",
    description : "List the commands available",
    execute(message) {
        const Discord = require("discord.js");
        const helpList = new Discord.MessageEmbed();

        // Build the embedded message
        helpList
            .setTitle("__Help__")
            .setColor("0099ff")
            .setThumbnail("https://oldschool.runescape.wiki/images/thumb/e/e4/Lumbridge_Guide.png/320px-Lumbridge_Guide.png?426c8")
            .addField("~report [message]", "Use this to give feedback/bug report", true)
            .addField("~about", "Quick introduction to the bot", true)
            .addField("~setrsn [player name]", "Set your rsn", true)
            //.addField("~mybosses [budget]", "eg: ~mybosses 500m", true)
            .addField("~mybosslist [budget]", "Lists bosses you can do with your budget", true)
            .addField("~showstats", "Shows your stats (must set rsn first)", true)
            .addField("~bosses", "A list of all bosses the bot has so far", true)
            .addField("~joke", "Sometimes the jokes are funny", true);
        // Send the message
        message.channel.send(helpList);
    }
}