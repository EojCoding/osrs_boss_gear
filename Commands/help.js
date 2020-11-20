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
            .addField("~report [message]", "eg: ~report XYZ is bugged", true)
            .addField("~about", "eg: ~about", true)
            .addField("~setrsn [player name]", "eg: ~setrsn lynx titan", true)
            //.addField("~mybosses [budget]", "eg: ~mybosses 500m", true)
            .addField("~mybosslist [budget]", "eg: ~mybosses 500m", true)
            .addField("~showstats", "eg: ~showstats", true)
            .addField("~tob [budget]", "eg: ~tob 510.27m", true)
            .addField("~dks [budget]", "eg: ~dks 15m", true)
            .addField("~kree [budget]", "eg: ~kree 150.1m", true)
            .addField("~bandos attacker [budget]", "eg: ~bandos attacker 150.1m", true)
            .addField("~bandos tank [budget]", "eg: ~bandos tank 150.1m", true)
            .addField("~joke", "eg: ~joke", true);
        // Send the message
        message.channel.send(helpList);
    }
}