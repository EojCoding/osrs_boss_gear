const fs = require("fs");
const logger = require("../Logs/logger");
const setups = {};

fs.readdir("/OSRS_Boss_Gear/Setups/Scorpia/", (err, files) => {
    if (err) {
        logger.logErrors(err);
    }

    files.forEach((file) => {
        const setup = require(`/OSRS_Boss_Gear/Setups/Scorpia/${file}`);
        setups[setup.name] = setup;
    });
});

module.exports = {
    name : "scorpia",
    description : "Gear for Scorpia",
    execute(message, budget) {
        message.channel.send("**Boss:** Scorpia \n**Budget:** " + budget + " gp");
        let response = "```ini\n";
        if (budget > 5000000) {
            const temp = setups["5mPlus"];
            for (const key in temp) {
                if (key !== "name") {
                    response += "["+key+"] -> "+temp[key]+"\n";
                }
            }
            response += "[inventory] -> { WIP }\n";
            response += "```";
            message.channel.send(response);
        }
        else {
            message.channel.send("Minimum budget is 5m");
        }
    }
}