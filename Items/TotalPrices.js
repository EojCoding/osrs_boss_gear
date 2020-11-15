/**
 * This file serves to help get the total cost of each setup
 */

const equipment = require("./equipment.json");
const logger = require("../Logs/Logger");

/**
 * With a given JSON object containing a gear set from ../Setups/ - look up each
 * item and sum the total of all their prices
 * @param setupJson
 * @returns {number}
 */
function getTotal(setupJson) {
    let total = 0;
    // Look at each JSON key value pair in equipment.json
    for (const [key,value] of Object.entries(setupJson)) {
        if (key === "inventory") {
            value.forEach((item) => {
                try {
                    total += equipment[item].price;
                } catch (e) {
                    logger.logErrors("[TYPO?] TotalPrices.js/getTotal() in inventory: " + item + " -> " + e);
                }

            });
        }
        else if (equipment.hasOwnProperty(value)) {
            try {
                total += equipment[value].price;
            } catch (e) {
                logger.logErrors("[TYPO?] TotalPrices.js/getTotal() in worn: " + value + " -> " + e);
            }
        }
    }
    return total;
}

module.exports = getTotal;