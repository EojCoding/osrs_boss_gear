const fs = require("fs");
const path = require("path");
const logger = require("../Logs/Logger");
const response = require("../Setups/Response");
const setups = {};

fs.readdir(path.resolve(__dirname, "../Setups/TOB/"), (err, files) => {
    if (err) {
        logger.logErrors(err);
    }
    files.forEach((file) => {
        const setup = require(`../Setups/TOB/${file}`);
        setups[setup.name] = setup;
    });
});

module.exports = {
    name: "tob",
    description: "Gear for TOB",
    execute(client, message, budget) {
        if (budget > 145000000 && budget < Number.MAX_SAFE_INTEGER) {
            response(client, budget, message, setups["145mPlus"]);
        }
        else {
            message.channel.send("Minimum budget is 145m");
        }
    }
}