const fs = require("fs");
const path = require("path");
const logger = require("../Logs/Logger");
const response = require("../Setups/Response");
const total = require("../Items/TotalPrices");
const setups = {};

fs.readdir(path.resolve(__dirname, "../Setups/TOB/"), (err, files) => {
    if (err) {
        logger.logErrors(err);
    }
    setups.size = 0;
    files.forEach((file) => {
        const setup = require(`../Setups/TOB/${file}`);
        setups[setup.name] = setup;
        setups.size += 1;
    });
});

module.exports = {
    name: "tob",
    description: "Gear for TOB",
    execute(client, message, budget) {
        for (let i = setups.size; i >= 1; i--) {
            if (budget > total(setups[i.toString()])) {
                response(client, budget, message, setups[i.toString()]);
                break;
            }
        }
        if (budget < total(setups["1"])) {
            message.channel.send("Minimum budget is " + total(setups["1"]).toLocaleString() + "gp");
        }
    }
}