const fs = require("fs");
const allItems = require("./item_summary.json");
const keys = Object.keys(allItems);
let textArray = fs.readFileSync("/OSRS_Boss_Gear/Items/boss_items.txt", "utf-8").split("\r\n");
const equipment = [];

// For each key:value pair in the huge JSON file with all items
for (const [key, value] of Object.entries(allItems)) {
    // Look at each item in the text file and grab the id + name to store in equipment.json
    for (let j = 0; j < textArray.length; j++) {
        const itemName = textArray[j].toLowerCase();
        const temp = value.name.toLowerCase();
        if (temp === itemName) {
            equipment.push(allItems[key]);
        }
    }
}
// Write the JSON object to a .json file
fs.writeFileSync("/OSRS_Boss_Gear/Items/equipment.json", JSON.stringify(equipment, null, "\t"));

