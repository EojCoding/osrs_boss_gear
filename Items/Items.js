const fs = require("fs");
const path = require("path");
const allItems = require("./items_complete.json");
let textArray = fs.readFileSync(path.resolve(__dirname, "./all_equippable_items.txt"), "utf-8")
                    .split("\r\n");
const equipment = require("./equipment.json");

// For each key:value pair in the huge JSON file with all items
for (const [key, value] of Object.entries(allItems)) {
    // Look at each item in the text file and grab the id + name to store in equipment.json
    for (let j = 0; j < textArray.length; j++) {
        let itemName = textArray[j].toLowerCase();
        let temp = value.name.toLowerCase();
        // Could consider removing this and just checking for hasOwnProperty() (as below)
        if (temp === itemName) {
            // Capitalise the first letter to match other APIs used
            itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
            // If the item is not already present in the list, add it
            if (!equipment.hasOwnProperty(itemName)) {
                let itemToAdd = {
                    "id": allItems[key].id,
                    "name": allItems[key].name,
                    "icon": allItems[key].icon
                };
                equipment[itemName] = itemToAdd;
                // Use the icon base64 string to create icons
                fs.writeFile(path.resolve(__dirname, "./Icons/"+itemToAdd.id+".png"),
                    itemToAdd.icon, "base64", () => {});
            }
        }
    }
}

// Write the JSON object to a .json file
fs.writeFileSync(path.resolve(__dirname, "./equipment.json"), JSON.stringify(equipment, null, "\t"));

// To be used as a standard across all item files
module.exports = equipment;

