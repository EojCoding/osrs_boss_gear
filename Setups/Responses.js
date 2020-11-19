const equipment = require("../Items/equipment.json");
const Discord = require("discord.js");
const gearBudget = require("./GearBudget");
const total = require("../Items/TotalPrices");
const fs = require("fs");
const path = require("path");
const logger = require("../Logs/Logger");
const player = require("../Players/Player");
const numEmojis = require("./numberemojis.json");

let messageIDs = new Map();

/**
 * This function serves as the entry point for Responses which grabs all the setups for the boss
 * provided and then sends them to GearBudget.js to be sorted in order of price
 * @param client
 * @param message
 * @param budget
 * @param boss
 */
function response(client, message, budget, boss) {
    // See ../Setups/GearBudget.js for implementation
    let allSetups = {};
    const args = message.content.slice(1).split(/ +/).slice(1);
    if (args.length === 0) {
        message.channel.send("The proper usage is: `~boss_name budget`\n" +
            "For example: `~tob 500000000` OR `~tob 500m` OR `~tob 180.7m`\n" +
            "Or for requesting a new feature use: `~report [type here]`");
        return;
    }
    console.log("From inside response budget: " + budget);
    let result = budget;
    // If the given budget is not an integer
    if (!Number.isInteger(budget)) {
        result = gearBudget.checkBudgetInput(budget);
    }
    let setups = getSetups(boss, allSetups);
    // If the result does not match any accepted criteria, send a helpful message
    if (result === -1) {
        message.channel.send("The proper usage is: ~boss_name budget\n" +
            "For example: ~tob 500000000 OR ~tob 500m OR ~tob 180.7m\n" +
            "Or for requesting a new feature use: ~report [type here]");
        return;
    }
    //todo: add minstats property to bossinfo.json (rename it?) with combat levels
    // if (player.checkStatRequirements(String(message.author.id), boss) === -1) {
    //     message.reply("You do not meet the minimum requirements for ");
    //     return;
    // }
    // If the budget matches and is greater than the minimum
    if (result >= total(setups["1"])) {
        let setupToUse = gearBudget.getSetupToUse(result, setups);
        successResponse(client, result, message, setupToUse);
    }
    else {
        message.channel.send("Minimum budget is " + total(setups["1"]).toLocaleString() + "gp");
    }
}

/**
 * If all information is validated in response() an embedded message is built and sent
 * back to the user who used the command.
 * @param client
 * @param budget
 * @param message
 * @param setupJson
 */
async function successResponse(client, budget, message, setupJson) {

    const withoutPrefix = message.content.slice(1);
    const split = withoutPrefix.split(/ +/);
    let boss = split[0].toLowerCase();
    const links = require("./bossinfo.json");

    // Look for commas in first element, this indicates a role boss from a reaction
    if (boss.includes(",")) {
        boss = boss.split(',');
        if (boss.length === 3) {
            boss = boss[0] + " " + boss[1];
        }
        else {
            boss = boss[0];
        }
    }
    // If using a normal command like ~bandos tank 5b where it has 3 args
    else if (split.length === 3) {
        boss = split[0] + " " + split[1]
    }

    let itemEmoji = "";

    const embedWorn = new Discord.MessageEmbed();
    const embedInventory = new Discord.MessageEmbed();
    const embedBoss = new Discord.MessageEmbed();
    const coinsEmoji = client.emojis.cache.find(emoji => emoji.name === "Coins_10000");
    embedBoss
        .setColor("0099ff")
        .setTitle(links[boss].name)
        .setURL(links[boss].strategy)
        .setDescription(`${coinsEmoji} **${budget.toLocaleString()}gp**`)
        .setThumbnail(links[boss].thumbnail)
        .setFooter("Consumables not included");

    embedWorn
        .setColor("#0099ff")
        .setThumbnail("https://oldschool.runescape.wiki/images/5/50/Worn_equipment.png?124cf");

    embedInventory
        .setColor("#0099ff")
        .setThumbnail("https://oldschool.runescape.wiki/images/d/db/Inventory.png?1e52e");

    let wornTotal = 0;
    let invTotal = 0;

    for (const key in setupJson) {
        let itemName = setupJson[key];
        let price = 0;
        // Don't display the "name" key
        if (key !== "name" && key !== "inventory") {
            // Get the emoji that matches this item
            if (itemName !== "none") {
                try {
                    itemEmoji = client.emojis.cache.find(emoji => emoji.name === equipment[itemName].id.toString());
                    price = equipment[itemName].price;
                    wornTotal += price;
                    embedWorn.addField(itemName, `${itemEmoji}\n${price.toLocaleString()}gp`, true);
                } catch (e) {
                    logger.logErrors(e + " -> " + itemName + " has no ID");
                }
            }
        }
        if (key === "inventory") {
            // Look up each item in equipment.json and output them to a "inventory" section
            itemName.forEach((prop) => {
                // If equipment.json has this property
                if (equipment.hasOwnProperty(prop)) {
                    if (itemName !== null) {
                        try {
                            itemEmoji = client.emojis.cache.find(emoji => emoji.name === equipment[prop].id.toString());
                            price = equipment[prop].price;
                            invTotal += price;
                            embedInventory.addField(prop, `${itemEmoji}\n${price.toLocaleString()}gp`, true);
                        } catch (e) {
                            logger.logErrors(e + " -> " + itemName + " has no ID");
                        }
                    }
                }
            });
        }
        price = 0;
    }

    let grandTotal = wornTotal + invTotal;

    // This creates a new line
    embedInventory
        .addField("\u200b", "\u200b")
        .addField("Grand total", `${coinsEmoji} ${grandTotal.toLocaleString()}gp`, true);

    try {
        if (split[2] === "DM") {
            await client.users.cache.get(split[3]).send(embedBoss);
            await client.users.cache.get(split[3]).send(embedWorn);
            await client.users.cache.get(split[3]).send(embedInventory);
        }
        else {
            await message.channel.send(embedBoss);
            await message.channel.send(embedWorn);
            await message.channel.send(embedInventory);
        }
    } catch (e) {
        logger.logErrors(e);
    }
}

/**
 * This function gets a list of all bosses available to the user when provided
 * with their budget. Each boss in their own embedded message.
 * @param bossMap
 * @param message
 * @param budget
 */
async function myBossesList(bossMap, message, budget) {
    let allSetups = {};
    let result = gearBudget.checkBudgetInput(budget);
    // Look at each key value pair in the boss map
    for (const [key, value] of bossMap.entries()) {
        // Get the list of setups for the boss (key)
        let setups = getSetups(key, allSetups);
        // Then check the budget against the setup costs
        if (result < total(setups["1"])) {
            bossMap.delete(key);
        }
        let setupToUse = gearBudget.getSetupToUse(result, setups);
    }

    // Get all the remaining bosses from the boss map and display them
    if (bossMap.size > 0) {
        for (const [key, value] of bossMap.entries()) {
            // Create a new embedded message for each boss that the player can do
            const bossListEmbed = new Discord.MessageEmbed();
            bossListEmbed
                .setColor("0099ff")
                .setTitle(value.name)
                .setURL(value.strategy)
                .setThumbnail(value.thumbnail)
                .setDescription(`${result.toLocaleString()}gp`)
                .setFooter(`React with 👍 to have me DM you (${message.author.username}) with the gear set.`);
            const sent = await message.channel.send(bossListEmbed);
            messageIDs.set(sent.id, key);
        }
    }
    else {
        message.channel.send("You don't meet the minimum budget for any boss");
    }
}

/**
 * This function gets a list of all bosses available to the user when provided
 * with their budget. All bosses in a single embedded message.
 * @param bossMap This is a map of bosses which
 * @param message
 * @param budget
 */
async function myBossList(bossMap, message, budget, client) {
    let allSetups = {};
    let result = gearBudget.checkBudgetInput(budget);
    // Look at each key value pair in the boss map
    for (const [key, value] of bossMap.entries()) {
        // Get the list of setups for the boss (key)
        let setups = getSetups(key, allSetups);
        // Then check the budget against the setup costs
        if (result < total(setups["1"])) {
            bossMap.delete(key);
        }
        let setupToUse = gearBudget.getSetupToUse(result, setups);
    }

    // Get all the remaining bosses from the boss map and display them
    if (bossMap.size > 0) {
        const bossListEmbed = new Discord.MessageEmbed();
        // This will store the keys of the bosses added to the list so that this array
        // can be set as the messageIDs value for the message id.
        const bossNames = new Map();
        bossListEmbed
            .setColor("#FF0000")
            .setTitle(budget + " gp : Your Boss List")
            .setDescription("*React to this message with the boss that you would like to see the gear for.*")
            .setThumbnail("https://oldschool.runescape.wiki/images/3/3a/Vannaka.png?b5716");
        let i = 1;
        for (const [key, value] of bossMap.entries()) {
            let bossEmoji = client.emojis.cache.find(emoji => emoji.name === key.replace(" ", ""));
            bossListEmbed
                .addField(`${bossEmoji}`, `**[${value.name}](${value.strategy})**`, true);
            // Storing the boss name and the emoji associated with it
            bossNames.set(key, bossEmoji);
            i++;
        }
        const sent = message.channel.send(bossListEmbed)
            .then((sentEmbed) => {
                for (const [key, value] of bossNames.entries()) {
                    let bossName = key;
                    bossName = bossName.replace(" ", ""); // Replace spaces (eg Bandos attacker isnt an emoji)
                    const react = client.emojis.cache.find((emoji) => emoji.name === bossName)
                    sentEmbed.react(react);
                }
                console.log(sentEmbed.id);
                messageIDs.set(sentEmbed.id, bossNames);
            });
        // Set the  message ID as the key and the bossNames map as value
        //await messageIDs.set(sent.id, bossNames);
    }
    else {
        message.channel.send("You don't meet the minimum budget for any boss");
    }
}

/**
 * This is a helper function to get all the setups in a JSON object for use in response().
 * @param bossName
 * @param setups
 * @returns {*}
 */
function getSetups(bossName, setups) {
    setups.size = 0;
    // Read all the setup JSON files from ../Setups/tob and store them in an array
    let setupsArray = fs.readdirSync(path.resolve(__dirname, bossName));
    setupsArray.forEach((file) => {
        const setup = require("./"+bossName+"/"+file);
        // User the setup name as the key
        setups[setup.name] = setup;
        setups.size += 1;
    });
    return setups;
}

module.exports = {
    response,
    myBossesList,
    myBossList,
    messageIDs
};