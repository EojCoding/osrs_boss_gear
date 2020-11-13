/**
 * This file serves to help get the total cost of each setup
 */

const equipment = require("./equipment.json");

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
                total += equipment[item].price;
            });
        }
        else if (equipment.hasOwnProperty(value)) {
            total += equipment[value].price;
        }
    }
    return total;
}

module.exports = getTotal;