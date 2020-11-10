const fs = require("fs");
const setups = {};
fs.readdir("/OSRS_Boss_Gear/Setups/TOB/", (err, files) => {
    if (err) {
        return console.log(err);
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
        let response = "```ini\n";
        if (budget > 145000000) {
            const temp = setups["145mPlus"];
            for (const key in temp) {
                if (key !== "name") {
                    response += "["+key+"] -> "+temp[key]+"\n";
                }
            }
            response += "```";
            message.channel.send(response);
        }
        else {
            message.channel.send("You're too poor");
        }
    }
}