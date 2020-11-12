const https = require("https");
const fs = require("fs");
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

        for (const [key, value] of Object.entries(equipment)) {
            let id = equipment[key].id;
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
        fs.writeFileSync("/OSRS_Boss_Gear/Items/equipment.json", JSON.stringify(equipment, null, "\t"));
    });

    res.on("error", (err) => {
       logger.logErrors(err);
    });
});

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

        for (const [key, value] of Object.entries(equipment)) {
            let id = equipment[key].id;
            if (result.hasOwnProperty(id)) {
                value.slot = result[id].equipment.slot;
            }
        }

        // Update equipment.json with pricing
        fs.writeFileSync("/OSRS_Boss_Gear/Items/equipment.json", JSON.stringify(equipment, null, "\t"));
    });
    res.on("error", (err) => {
       logger.logErrors(err);
    });
});

function updateAll() {
    updatePrices();
    slotsList.forEach((slot) => {
        updateSlots(slot);
    });
    logger.logUpdates();
}

updateAll();

module.exports = {
    updateAll
};