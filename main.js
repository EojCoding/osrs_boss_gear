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
const messageIDs = require("./Setups/Responses");

// Store commands in this
client.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    client.commands.set(command.name, command);
}

// Begin the bot client
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
        status: "online",
        activity: {
            name: " for ~help",
            type: "WATCHING"
        }
    });
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
    // If the message starts with the prefix, but the command is not recognised
    else if (message.content.startsWith(PREFIX) && !client.commands.has(command)) {
        message.reply("That command was not found");
    }

    // Switch block for commands
    switch (command) {
        case "mybosses":
            client.commands.get("mybosses").execute(client, message);
            break;
        case "tob":
            client.commands.get("tob").execute(client, message, budget, command);
            break;
        case "dks":
            client.commands.get("dks").execute(client, message, budget, command);
            break;
        case "kree":
            client.commands.get("kree").execute(client, message, budget, command);
            break;
        case "bandos":
            client.commands.get("bandos").execute(client, message);
            break;
        case "setrsn":
            client.commands.get("setrsn").execute(message, args);
            break;
        case "showstats":
            client.commands.get("showstats").execute(message, args, client);
            break;
        case "about":
            client.commands.get("about").execute(client, message);
            break;
    }
});

client.on("messageReactionAdd", (reaction) => {

    if (messageIDs.messageIDs.has(reaction.message.id)) {
        if (reaction.emoji.name === "👍") {
            let boss = messageIDs.messageIDs.get(reaction.message.id);
            boss = boss.split(/ +/);
            // Need to work on sending a DM with the full setup
            const budget = reaction.message.embeds[0].description
                .split(",").join("").replace("gp","");
            boss.push(budget);

            // Manually set the message content so that it can be parsed properly in Response.js
            // Added DM to the end to indicate that the set should be DMd to the user
            let sender = {};
            reaction.users.cache.forEach((user, Snowflake) => {
                sender = user;
                reaction.users.cache.delete(Snowflake);
            });
            reaction.message.content = PREFIX + boss + " " + budget + " DM " + sender;

            // If the boss does not have specific roles, give it just the boss name
            // Bosses with roles have a different execute function
            console.log(boss);
            if (boss.length === 2) {
                client.commands.get(boss[0]).execute(client, reaction.message, boss[1], boss[0]);
            }
            else {
                client.commands.get(boss[0]).execute(client, reaction.message, boss);
            }
        }
    }
});

client.login(TOKEN);
