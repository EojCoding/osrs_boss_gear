const responses = require("../Setups/Responses");

// Export JSON
module.exports = {
    name: "bandos",
    description: "Gear for bandos",
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
            message.channel.send("The proper usage is: `~bandos [attacker/tank] [budget]`");
            return;
        }
        if (role !== "attacker" && role !== "tank") {
            message.channel.send("The proper usage is: `~bandos [attacker/tank] [budget]`");
            return;
        }
        // Set default to tank
        let boss = "bandos tank";
        if (role === "attacker") {
            boss = "bandos attacker";
        }
        responses.response(client, message, budget, boss);
    }
}