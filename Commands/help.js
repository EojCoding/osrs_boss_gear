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
        helpList.setTitle("Help");
        helpList.setDescription("List of commands")
        helpList.setColor("0099ff");
        helpList.setThumbnail("https://oldschool.runescape.wiki/images/thumb/e/e4/Lumbridge_Guide.png/320px-Lumbridge_Guide.png?426c8");
        helpList.addField("~report [message]", "eg: ~report XYZ is bugged");
        helpList.addField("~tob [budget]", "eg: ~tob 510.27m", true);
        // Send the message
        message.channel.send(helpList);
    }
}