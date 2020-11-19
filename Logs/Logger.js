const fs = require("fs");

let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
let fullDate = year+"-"+month+"-"+date;
let time = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()

/**
 * Write command messages to commandlogs.txt
 * @param command
 * @param args
 */
function logCommands(command, args) {
    fs.appendFile("./Logs/commandlogs.txt", "["+fullDate+"] "+time+": Command: " + command + " -> Args: " + args.join(" ") + "\n", (error) => {
        if (error) {
            return "Error occurred" + error;
        }
    });
}

/**
 * Write error messages to errorlogs.txt
 * @param error
 */
function logErrors(error) {
    fs.appendFile("./Logs/errorlogs.txt", "["+fullDate+"] "+time+": Error: " + error +"\n", (error) => {
        if (error) {
            return "Error occurred" + error;
        }
    });
}

/**
 * Write updates to updatelogs.txt
 * @param update
 */
function logUpdates(update) {
    fs.appendFile("./Logs/updatelogs.txt", "["+fullDate+"] "+time+": Updated\n", (error) => {
        if (error) {
            return "Error occurred" + error;
        }
    });
}
/**
 * Write Database activity to DBlogs.txt
 * @param update
 */
function logDB(update) {
    fs.appendFile("./Logs/DBlogs.txt", "["+fullDate+"] "+time+": "+update+"\n", (error) => {
        if (error) {
            return "Error occurred" + error;
        }
    });
}

module.exports = {
    logCommands,
    logErrors,
    logUpdates,
    logDB
}