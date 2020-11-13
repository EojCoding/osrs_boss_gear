/**
 * This helps to get prices for anomalous items
 */

const equipment = require("./equipment.json");

function getPrice(itemName) {
    if (equipment.hasOwnProperty(itemName)) {
        return equipment[itemName].price;
    }
}

module.exports = getPrice;