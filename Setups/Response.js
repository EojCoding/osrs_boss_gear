const equipment = require("../Items/equipment.json");
const Discord = require("discord.js");
let itemEmoji = "";

function buildResponse(client, budget, message, setupJson) {

    const embedWorn = new Discord.MessageEmbed();
    const embedInventory = new Discord.MessageEmbed();
    const embedBoss = new Discord.MessageEmbed();
    const coinsEmoji = client.emojis.cache.find(emoji => emoji.name === "Coins_10000");

    embedBoss.setColor("0099ff");
    embedBoss.setTitle("Theatre of Blood");
    embedBoss.setURL("https://oldschool.runescape.wiki/w/Theatre_of_Blood/Strategies");
    embedBoss.setDescription(`${coinsEmoji} **${budget.toLocaleString()}gp**`);
    embedBoss.setThumbnail("https://oldschool.runescape.wiki/images/7/74/Verzik_Vitur.png?28c0a");

    embedWorn.setColor("#0099ff");
    embedWorn.setThumbnail("https://oldschool.runescape.wiki/images/5/50/Worn_equipment.png?124cf");
    embedWorn.setTitle("Worn");

    embedInventory.setColor("#0099ff");
    embedInventory.setThumbnail("https://oldschool.runescape.wiki/images/d/db/Inventory.png?1e52e");
    embedInventory.setTitle("Inventory");

    let wornTotal = 0;
    let invTotal = 0;

    for (const key in setupJson) {
        let itemName = setupJson[key];
        let price = 0;
        // Don't display the "name" key
        if (key !== "name" && key !== "inventory") {
            // Get the emoji that matches this item
            console.log(itemName);
            if (itemName !== "none") {
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

module.exports = buildResponse;