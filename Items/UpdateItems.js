/**
 * The functions here are executed multiple times daily to ensure that the items in equipment.json
 * are as up to date as possible.
 */

const https = require("https");
const fs = require("fs");
const path = require("path");
const logger = require("../Logs/Logger");
const equipment = require("./Items");
const slotsList = ["2h", "ammo", "body", "cape", "feet", "hands", "head", "legs", "neck", "ring", "shield", "weapon"];

// Creating an API call to rsbuddy to obtain up-to-date GE pricing
const updatePrices = () => https.get("https://storage.googleapis.com/osb-exchange/summary.json", (res) => {
    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });
    // When no more data is to be received
    res.on("end", () => {
        // Save the parsed JSON to a variable
        let result = JSON.parse(data);
        // Look at every item in equipment.json
        for (const [key, value] of Object.entries(equipment)) {
            let id = equipment[key].id;
            // If the returned JSON has a same ID as equipment, check the prices
            if (result.hasOwnProperty(id)) {
                if (result[id].buy_average > 0) {
                    value.price = result[id].buy_average;
                }
                else if (result[id].sell_average > 0) {
                    value.price = result[id].sell_average;
                }
            }
        }
        // Update equipment.json with pricing
        fs.writeFileSync(path.resolve(__dirname, "./equipment.json"), JSON.stringify(equipment, null, "\t"));
    });

    res.on("error", (err) => {
       logger.logErrors(err);
    });
});

// Create an API call to update the slot property of each item in equipment.json
const updateSlots = (slot) => https.get("https://www.osrsbox.com/osrsbox-db/items-json-slot/items-"+slot+".json", (res) => {
    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });
    res.on("end", () => {
        // Save the parsed JSON to a variable
        let result = "";
        try {
            result = JSON.parse(data);
        } catch (err) {
            logger.logErrors(err);
        }

        // For each key value pair in equipment.json
        for (const [key, value] of Object.entries(equipment)) {
            let id = equipment[key].id;
            // If the equipment.json item does not have the "slot" property (to combat overwriting manual changes made)
            if (!equipment[key].hasOwnProperty(slot)) {
                // And the JSON from the api call has the same id
                if (result.hasOwnProperty(id)) {
                    // Add the slot property
                    value.slot = result[id].equipment.slot;
                }
            }
        }

        // Update equipment.json with pricing
        fs.writeFileSync(path.resolve(__dirname, "./equipment.json"), JSON.stringify(equipment, null, "\t"));
    });
    res.on("error", (err) => {
       logger.logErrors(err);
    });
});

/**
 * Condenses both functions above and executed them consecutively.
 */
function updateAll() {
    updatePrices();
    slotsList.forEach((slot) => {
        updateSlots(slot);
    });
    logger.logUpdates();
}

setInterval(() => {
    let time = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
    console.log("Updated: " + time);
    updateAll();
}, 7200000);

// Export JSON (not in use currently)
module.exports = {
    updateAll
};