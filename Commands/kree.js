const responses = require("../Setups/Responses");

// Export JSON
module.exports = {
    name: "kree",
    description: "Gear for kree",
    execute(client, message, budget, boss) {
        responses.response(client, message, budget, boss);
    }
}