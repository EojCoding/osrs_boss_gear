const fs = require("fs");
const logger = require("../Logs/Logger");
const response = require("../Setups/Response");
const setups = {};

fs.readdir("/OSRS_Boss_Gear/Setups/TOB/", (err, files) => {
    if (err) {
        logger.logErrors(err);
    }
    files.forEach((file) => {
        const setup = require(`/OSRS_Boss_Gear/Setups/TOB/${file}`);
        setups[setup.name] = setup;
    });
});

module.exports = {
    name : "tob",
    description : "Gear for TOB",
    execute(message, budget) {
        message.channel.send("**Boss:** Theatre of Blood \n**Budget:** " + budget + " gp");
        if (budget > 145000000) {
            message.channel.send(response(setups["145mPlus"]));
        }
        else {
            message.channel.send("Minimum budget is 145m");
        }
    }
}