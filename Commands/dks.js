const responses = require("../Setups/Responses");

// Export JSON
module.exports = {
    name: "dks",
    description: "Gear for dks",
    execute(client, message, budget, boss) {
        responses.response(client, message, budget, boss);
    }
}