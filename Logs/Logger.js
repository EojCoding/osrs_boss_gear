require("dotenv/config");
const fs = require("fs");
const AWS = require("aws-sdk");
const S3 = new AWS.S3({
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET
});

let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
let fullDate = year+"-"+month+"-"+date;
let time = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()

/**
 * Write command messages to commandlogs.txt
 * @param command
 * @param args
 */
function logCommands(command, args) {
    const fileName = "./Logs/commandlogs.txt";
    fs.appendFile(fileName, "["+fullDate+"] "+time+": Command: " + command + " -> Args: " + args.join(" ") + "\n", (error) => {
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
    const fileName = "./Logs/errorlogs.txt";
    fs.appendFile(fileName, "["+fullDate+"] "+time+": Error: " + error +"\n", (error) => {
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
    const fileName = "./Logs/updatelogs.txt";
    fs.appendFile(fileName, "["+fullDate+"] "+time+": Updated\n", (error) => {
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
    const fileName = "./Logs/DBlogs.txt";
    fs.appendFile(fileName, "["+fullDate+"] "+time+": "+update+"\n", (error) => {
        if (error) {
            return "Error occurred" + error;
        }
        uploadToBucket()
    });
}

/**
 * This function takes in a file and uploads it to a S3 bucket.
 * @param fileName The file to be uploaded
 */
function uploadToBucket(fileName) {
    //fileName = "/Logs/"+fileName; // Change it to this so it appears this was in S3
    const fileContent = fs.readFileSync(fileName);
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileContent
    };

    try {
        S3.upload(uploadParams, (err, data) => {
            if (err) {
                console.log(err);
            }
            logUpdates(`File uploaded to ${data.location}`);
        });
    } catch (err) {
        logErrors(err);
    }
}

module.exports = {
    logCommands,
    logErrors,
    logUpdates,
    logDB
}