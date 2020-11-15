const responses = require("../Setups/Responses");

// Export JSON
module.exports = {
    name: "tob",
    description: "Gear for tob",
    execute(client, message, budget, boss) {
        responses.response(client, message, budget, boss);
    }
}
