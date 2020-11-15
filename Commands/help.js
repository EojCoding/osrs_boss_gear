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
            .setTitle("Help")
            .setDescription("List of commands")
            .setColor("0099ff")
            .setThumbnail("https://oldschool.runescape.wiki/images/thumb/e/e4/Lumbridge_Guide.png/320px-Lumbridge_Guide.png?426c8")
            .addField("~report [message]", "eg: ~report XYZ is bugged")
            .addField("~setrsn [player name]", "eg: ~setrsn lynx titan")
            .addField("~mybosses [budget]", "eg: ~mybosses 500m")
            .addField("~showstats", "eg: ~showstats")
            .addField("~tob [budget]", "eg: ~tob 510.27m")
            .addField("~dks [budget]", "eg: ~dks 15m")
            .addField("~kree [budget]", "eg: ~kree 150.1m")
            .addField("~bandos [tank/attacker] [budget]", "eg: ~bandos attacker 150.1m");
        // Send the message
        message.channel.send(helpList);
    }
}