const responses = require("../Setups/Responses");

// Export JSON
module.exports = {
    name: "vorkath",
    description: "Gear for vorkath",
    execute(client, message, givenBoss) {
        let args = message.content.slice(1).split(/ +/).slice(1);
        let role = args[0];
        let budget = args[1];
        if (typeof givenBoss !== "undefined") {
            args = givenBoss;
            role = args[1];
            budget = args[2];
        }
        if (args.length < 2) {
            message.channel.send("The proper usage is: `~vorkath [range/melee] [budget]`");
            return;
        }
        if (role !== "range" && role !== "melee") {
            message.channel.send("The proper usage is: `~vorkath [range/melee] [budget]`");
            return;
        }
        // Set default to range
        let boss = "vorkath range";
        if (role === "melee") {
            boss = "vorkath melee";
        }
        responses.response(client, message, budget, boss);
    }
}