const fs = require("fs");
const allItems = require("./item_summary.json");
let textArray = fs.readFileSync("/OSRS_Boss_Gear/Items/all_equippable_items.txt", "utf-8").split("\r\n");
const equipment = {};

// For each key:value pair in the huge JSON file with all items
for (const [key, value] of Object.entries(allItems)) {
    // Look at each item in the text file and grab the id + name to store in equipment.json
    for (let j = 0; j < textArray.length; j++) {
        let itemName = textArray[j].toLowerCase();
        let temp = value.name.toLowerCase();
        if (temp === itemName) {
            // Capitalise the first letter to match other APIs used
            itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
            // If the item is not already present in the list
            if (!equipment.hasOwnProperty(itemName)) {
                equipment[itemName] = allItems[key];
            }
        }
    }
}


// Write the JSON object to a .json file
fs.writeFileSync("/OSRS_Boss_Gear/Items/equipment.json", JSON.stringify(equipment, null, "\t"));

// To be used as a standard across all item files
module.exports = equipment;

