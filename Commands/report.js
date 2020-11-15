/**
 * The ~report commands allows users to submit feedback about features or bugs
 * and saves their messages to a local text file ../Requests/requests.txt
 * @type {module:fs}
 */

const fs = require("fs");

// Export JSON
module.exports = {
    name : "report",
    description : "feature requests",
    execute(message, args) {
        // Build the string that gets written to the output text file
        fs.appendFile("./Requests/requests.txt", `[${message.member.user.tag}] says: ` +  args.join(" ") + "\n", error => {
            if (error) {
                return "Error occurred" + error;
            }
        });
        message.channel.send(`Thanks for your feedback!`);
    }
}