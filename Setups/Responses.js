const equipment = require("../Items/equipment.json");
const Discord = require("discord.js");
const gearBudget = require("./GearBudget");
const total = require("../Items/TotalPrices");
const fs = require("fs");
const path = require("path");
const logger = require("../Logs/Logger");
const player = require("../Players/Player");

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
    let result = gearBudget.checkBudgetInput(budget);
    let setups = getSetups(boss, allSetups);
    // If the result does not match any accepted criteria, send a helpful message
    if (result === -1) {
        message.channel.send("The proper usage is: ~boss_name budget\n" +
            "For example: ~tob 500000000 OR ~tob 500m OR ~tob 180.7m\n" +
            "Or for requesting a new feature use: ~report [type here]");
        return;
    }
    //todo: add minstats property to bossinfo.json (rename it?) with combat levels
    if (player.checkStatRequirements(String(message.author.id), boss) === -1) {
        message.reply("You do not meet the minimum requirements for ");
        return;
    }
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
function successResponse(client, budget, message, setupJson) {

    const withoutPrefix = message.content.slice(1);
    const split = withoutPrefix.split(/ +/);
    const boss = split[0].toLowerCase();
    const links = require("./bossinfo.json");

    let itemEmoji = "";

    const embedWorn = new Discord.MessageEmbed();
    const embedInventory = new Discord.MessageEmbed();
    const embedBoss = new Discord.MessageEmbed();
    const coinsEmoji = client.emojis.cache.find(emoji => emoji.name === "Coins_10000");

    embedBoss.setColor("0099ff");
    embedBoss.setTitle(links[boss].name);
    embedBoss.setURL(links[boss].strategy);
    embedBoss.setDescription(`${coinsEmoji} **${budget.toLocaleString()}gp**`);
    embedBoss.setThumbnail(links[boss].thumbnail);

    embedWorn.setColor("#0099ff");
    embedWorn.setThumbnail("https://oldschool.runescape.wiki/images/5/50/Worn_equipment.png?124cf");

    embedInventory.setColor("#0099ff");
    embedInventory.setThumbnail("https://oldschool.runescape.wiki/images/d/db/Inventory.png?1e52e");

    let wornTotal = 0;
    let invTotal = 0;

    for (const key in setupJson) {
        let itemName = setupJson[key];
        let price = 0;
        // Don't display the "name" key
        if (key !== "name" && key !== "inventory") {
            // Get the emoji that matches this item
            if (itemName !== "none") {
                console.log(itemName);
                itemEmoji = client.emojis.cache.find(emoji => emoji.name === equipment[itemName].id.toString());
                price = equipment[itemName].price;
                wornTotal += price;
                embedWorn.addField(itemName, `${itemEmoji}\n${price.toLocaleString()}gp`, true);
            }
        }
        if (key === "inventory") {
            // Look up each item in equipment.json and output them to a "inventory" section
            itemName.forEach((prop) => {
                // If equipment.json has this property
                if (equipment.hasOwnProperty(prop)) {
                    if (itemName !== null) {
                        itemEmoji = client.emojis.cache.find(emoji => emoji.name === equipment[prop].id.toString());
                        price = equipment[prop].price;
                        invTotal += price;
                        embedInventory.addField(prop, `${itemEmoji}\n${price.toLocaleString()}gp`, true);
                    }
                }
            });
        }
        price = 0;
    }

    let grandTotal = wornTotal + invTotal;

    message.channel.send(embedBoss);
    message.channel.send(embedWorn);
    embedInventory.addField("\u200b", "\u200b"); // This creates a new line
    embedInventory.addField("Grand total", `${coinsEmoji} ${grandTotal.toLocaleString()}gp`, true);
    message.channel.send(embedInventory);
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
    response
};