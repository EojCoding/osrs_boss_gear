const Discord = require("discord.js");

// Export JSON
module.exports = {
    name: "about",
    description: "About the bot",
    execute(client, message) {
        const embedAbout = new Discord.MessageEmbed();

        embedAbout
            .setColor("#0099ff")
            .setTitle("About")
            .setAuthor("Karepow#0133", "https://media1.tenor.com/images/7c0b33dabe1a0328062e9066319edf98/tenor.gif?itemid=14110516")
            .setDescription("Boss Gear attempts to help you decide what gear to bring to a boss that you choose, with a " +
                "budget that you provide through the commands.")
            .addField("~help", "Use this command to get started and see the list of currently available commands")
            .addField("~report", "If you have feedback, a suggestion or notice a bug, please use this!")
            .setThumbnail("https://oldschool.runescape.wiki/images/4/45/Cake_of_guidance_detail.png?0c602")
            .setFooter("Credits: \"Only Blazers\" for the idea");

        message.channel.send(embedAbout);
    }
}