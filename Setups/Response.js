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
            // Look up each item in equipment.json and output them to a "inventory" section
            setupJson[key].forEach((item) => {
                // If equipment.json has this item
                if (equipment.hasOwnProperty(item)) {
                    response += "\t"+item+"\n";
                }
            });
            response += "}\n"
        }
    }
    response += "```";

    return response;
}

module.exports = buildResponse;