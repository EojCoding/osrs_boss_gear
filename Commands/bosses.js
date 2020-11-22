module.exports = {
    name: "bosses",
    description: "Lists all bosses",
    execute(message) {
        const Discord = require("discord.js");
        const bossList = new Discord.MessageEmbed();

        bossList
            .setColor("#FF0000")
            .setThumbnail("https://oldschool.runescape.wiki/images/6/67/Boss.png?fb192")
            .setTitle("List of Boss Commands")
            .setDescription("~bandos attacker [budget]\n" +
                "~bandos tank [budget]\n" +
                "~dks [budget]\n" +
                "~kree [budget]\n" +
                "~tob [budget]\n" +
                "~vorkath melee [budget]\n" +
                "~vorkath range [budget]\n")

        message.channel.send(bossList);
    }
}