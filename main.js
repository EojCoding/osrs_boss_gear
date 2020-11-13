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
const logger = require("./Logs/Logger");

// Store commands in this
client.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    client.commands.set(command.name, command);
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
    if (message.content.startsWith("~report") && args.length > 0) {
        client.commands.get("report").execute(message, args);
        return;
    }
    if (message.content.startsWith("~help") && args.length === 0) {
        client.commands.get("help").execute(message);
        return;
    }
    // If the messages does not start with the prefix or does not match the pattern
    else if (message.content.startsWith(PREFIX) && !message.content.match(pattern)) {
        message.reply("The proper usage is: ~boss_name budget\n" +
            "For example: ~tob 500000000 OR ~tob 500m OR ~tob 180.7m\n" +
            "Or for requesting a new feature use: ~requestboss [type here]");
        return;
    }
    // If the message starts with the prefix, but the command is not recognised
    else if (message.content.startsWith(PREFIX) && !client.commands.has(command)) {
        message.reply("That command was not found");
    }

    // Switch block for commands
    switch (command) {
        case "tob":
            client.commands.get("tob").execute(client, message, budget);
            break;
    }
});

client.login(TOKEN);
