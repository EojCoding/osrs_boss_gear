const https = require("https");
const fs = require("fs");
const currentItems = require("./equipment.json");

// Creating an API call to rsbuddy to obtain up-to-date GE pricing
https.get("https://rsbuddy.com/exchange/summary.json", (res) => {
    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", () => {
        // Save the parsed JSON to a variable
        let result = JSON.parse(data);
        let saveToFile = [];
        currentItems.forEach((entry) => {
            if (result.hasOwnProperty(entry.id)) {
                //saveToFile.push(result[entry.id]);
                //console.log(result[entry.id]);
                entry.price = result[entry.id].buy_average;
                saveToFile.push(entry);
            }
        });
        fs.writeFileSync("/OSRS_Boss_Gear/Items/test.json", JSON.stringify(saveToFile, null, "\t"));
        //console.log(currentItems);
    });

    res.on("error", (err) => {
       console.log("[DEBUG]: " + err);
    });
});