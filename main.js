/**
 * A Discord bot to provide the user with a gear setup according to their budget
 *
 * BETA
 *
 * @author Joe Reynolds
 * @version 1.0.0
 */

const Discord = require("discord.js");
const client = new Discord.Client();
const { PREFIX, TOKEN } = require("./config.json");
const fs = require("fs");
const commandFiles = fs.readdirSync("./Commands/").filter(file => file.endsWith(".js"));
const logger = require("./Logs/logger");
const updater = require("./Items/UpdateItems");

// Store commands in this
client.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    client.commands.set(command.name, command);
}

// If it is 5pm local time, update all items
let hour = new Date().getHours();
if (hour === 17) {
    updater.updateAll();
}

// Begin the bot client
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", (message) => {
    // Check if the author of the message is the bot itself
    if (message.author.bot) {
        return;
    }

    // Grab the message with the prefix and separated from it
    const withoutPrefix = message.content.slice(PREFIX.length);
    const split = withoutPrefix.split(/ +/);
    const args = split.slice(1);
    const pattern = /^~[a-zA-Z]+\s[0-9]+/;

    // Get the boss and budget from the user input
    const command = split[0].toLowerCase();
    const budget = split[1];

    // Ignore the message if it doesn't start with the prefix
    if (!message.content.startsWith(PREFIX)) {
        return;
    }

    // Log all messages if the message starts with the prefix
    logger.logCommands(command, args);

    // If a new boss is being requested
    if (message.content.startsWith("~requestboss") && args.length > 0) {
        client.commands.get("requestboss").execute(message, args);
    }
    // If the messages does not start with the prefix or does not match the pattern
    else if (message.content.startsWith(PREFIX) && !message.content.match(pattern)) {
        message.reply("The proper usage is: ~boss_name budget\n" +
            "For example: ~scorpia 5000000\n" +
            "Or for requesting a new feature use: ~requestboss [type here]");
        return;
    }
    // If the message starts with the prefix, but the command is not recognised
    else if (message.content.startsWith(PREFIX) && !client.commands.has(command)) {
        message.reply("That command was not found");
    }

    // Switch block for commands
    switch (command) {
        case "scorpia":
            client.commands.get("scorpia").execute(message, Number(budget));
            break;
        case "tob":
            client.commands.get("tob").execute(message, Number(budget));
            break;
    }
});

client.login(TOKEN);
