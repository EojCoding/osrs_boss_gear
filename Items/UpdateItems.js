const https = require("https");
const fs = require("fs");
const logger = require("../Logs/logger");
const equipment = require("./items");

// Creating an API call to rsbuddy to obtain up-to-date GE pricing
const updatePrices = https.get("https://rsbuddy.com/exchange/summary.json", (res) => {
    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });

    // When no more data is to be received
    res.on("end", () => {
        // Save the parsed JSON to a variable
        let result = JSON.parse(data);
        equipment.forEach((item) => {
            if (result.hasOwnProperty(item.id)) {
                item.price = result[item.id].buy_average;
            }
        });
        // Update equipment.json with pricing
        fs.writeFileSync("/OSRS_Boss_Gear/Items/equipment.json", JSON.stringify(equipment, null, "\t"));
    });

    res.on("error", (err) => {
       logger.logErrors(err);
    });
});

const slotsList = ["2h", "ammo", "body", "cape", "feet", "hands", "head", "legs", "neck", "ring", "shield", "weapon"];

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
        //console.log(result);
        equipment.forEach((item) => {
            if (result.hasOwnProperty(item.id)) {
                item.slot = result[item.id].equipment.slot;
            }
        });
        // Update equipment.json with pricing
        fs.writeFileSync("/OSRS_Boss_Gear/Items/equipment.json", JSON.stringify(equipment, null, "\t"));
    });
    res.on("error", (err) => {
       logger.logErrors(err);
    });
});

slotsList.forEach((slot) => {
    updateSlots(slot);
});

module.exports = {
    updatePrices,
    updateSlots
};