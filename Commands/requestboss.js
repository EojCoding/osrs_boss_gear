const fs = require("fs");

module.exports = {
    name : "requestboss",
    description : "feature requests",
    execute(message, args) {
        let newRequest = "New request: ";
        fs.appendFile("./Requests/requests.txt", newRequest + args.join(" ") + "\n", error => {
            if (error) {
                return "Error occurred" + error;
            }
        });
        message.channel.send(`Hi ${message.author}! Your request was added.`);
    }
}