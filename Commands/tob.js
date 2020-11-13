const fs = require("fs");
const path = require("path");
const logger = require("../Logs/Logger");
const response = require("../Setups/Response");
const total = require("../Items/TotalPrices");
const budgetParser = require("../Setups/BudgetParser");
const setups = {};

// Read all the setup JSON files from ../Setups/TOB and store them in an array
fs.readdir(path.resolve(__dirname, "../Setups/TOB/"), (err, files) => {
    if (err) {
        logger.logErrors(err);
    }
    setups.size = 0;
    files.forEach((file) => {
        const setup = require(`../Setups/TOB/${file}`);
        // User the setup name as the key
        setups[setup.name] = setup;
        setups.size += 1;
    });
});

// Export JSON
module.exports = {
    name: "tob",
    description: "Gear for TOB",
    execute(client, message, budget) {
        // See ../Setups/BudgetParser.js for implementation
        let result = budgetParser(budget);
        // Log to console for debugging purposes
        console.log("The result is "+result);
        // If the result does not match any accepted criteria, send a helpful message
        if (result === -1) {
            message.channel.send("The proper usage is: ~boss_name budget\n" +
                "For example: ~tob 500000000 OR ~tob 500m OR ~tob 180.7m\n" +
                "Or for requesting a new feature use: ~requestboss [type here]");
            return;
        }
        console.log("Min budget is "+total(setups["1"]));
        // If the budget matches and is greater than the minimum
        if (result >= total(setups["1"])) {
            // Begin at the most expensive gear setup and work backwards
            for (let i = setups.size; i >= 1; i--) {
                if (result >= total(setups[i.toString()])) {
                    // See ../Setups/Response.js for implementation
                    response(client, result, message, setups[i.toString()]);
                    return;
                }
            }
        }
        else {
            message.channel.send("Minimum budget is " + total(setups["1"]).toLocaleString() + "gp");
        }
    }
}