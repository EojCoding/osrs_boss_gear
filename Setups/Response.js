const equipment = require("../Items/equipment.json");

function buildResponse(setupJson) {
    let response = "```ini\n";
    for (const key in setupJson) {
        // Don't display the "name" key
        if (key !== "name") {
            response += "["+key+"] -> "+setupJson[key]+"\n";
        }
        if (key === "inventory") {
            response += "[inventory] -> {\n";
            // This is an array of items
            let temp = setupJson[key];
            // Look up each item in equipment.json and output them to a "inventory" section
            temp.forEach((item) => {
                if (equipment.hasOwnProperty(item)) {

                }
            });
        }
    }
    response += "[inventory] -> { WIP }\n";
    response += "```";

    return response;
}

module.exports = buildResponse;