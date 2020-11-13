const equipment = require("./equipment.json");

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