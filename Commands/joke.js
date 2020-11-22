const https = require("https");

module.exports = {
    name: "joke",
    description: "Random joke",
    execute(message) {
        https.get("https://official-joke-api.appspot.com/jokes/random", res => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                // Save the parsed JSON to a variable
                let result = "";
                try {
                    result = JSON.parse(data);
                } catch (err) {
                    console.log(err);
                }

                setTimeout(() => {
                    message.channel.send(result.punchline);
                }, 3000);
                message.channel.send(result.setup);
            });
        })
    }
}