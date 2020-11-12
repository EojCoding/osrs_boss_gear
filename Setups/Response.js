const equipment = require("../Items/equipment.json");
const Discord = require("discord.js");
const embedWorn = new Discord.MessageEmbed();
const embedInventory = new Discord.MessageEmbed();
const embedBoss = new Discord.MessageEmbed();
const embedBudget = new Discord.MessageEmbed();

function buildResponse(budget, message, setupJson) {

    embedBoss.setColor("0099ff");
    embedBoss.setTitle("Theatre of Blood");
    embedBoss.setThumbnail("https://oldschool.runescape.wiki/images/7/74/Verzik_Vitur.png?28c0a");

    embedBudget.setColor("0099ff");
    embedBudget.setTitle("Budget \n" + budget + "gp");
    embedBudget.setThumbnail("https://oldschool.runescape.wiki/images/3/30/Coins_10000.png?7fa38");

    embedWorn.setColor("#0099ff");
    embedWorn.setThumbnail("https://oldschool.runescape.wiki/images/5/50/Worn_equipment.png?124cf");
    embedWorn.setTitle("Worn");

    let icons = [];

    for (const key in setupJson) {
        let itemName = setupJson[key];
        // Don't display the "name" key
        if (key !== "name" && key !== "inventory") {
            embedWorn.addField(equipment[itemName].slot, itemName, true);
            icons.push("/osrs_boss_gear/Items/Icons/"+equipment[itemName].id+".png");
        }
        if (key === "inventory") {
            embedInventory.setColor("#0099ff");
            embedInventory.setThumbnail("https://oldschool.runescape.wiki/images/d/db/Inventory.png?1e52e");
            embedInventory.setTitle("Inventory");
            // Look up each item in equipment.json and output them to a "inventory" section
            itemName.forEach((prop) => {
                // If equipment.json has this property
                if (equipment.hasOwnProperty(prop)) {
                    embedInventory.addField(equipment[prop].slot, prop, true);
                }
            });
        }
    }
    message.channel.send(embedBoss);
    message.channel.send(embedBudget);
    message.channel.send(embedWorn);
    message.channel.send(embedInventory);
}

module.exports = buildResponse;