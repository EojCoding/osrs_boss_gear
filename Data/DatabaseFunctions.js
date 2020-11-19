require("dotenv/config");
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(process.env.DB_CONNECTION, { useUnifiedTopology: true });
const logger = require("../Logs/Logger");
const fs = require("fs")
const path = require("path");
// Collection constants
const dbCollections = {
    GEAR_SETUPS: "GearSetups",
    BOSS_INFO: "BossInfo",
    RSN_LIST: "RSNList",
    EQUIPMENT: "Equipment"
}

/**
 * A function that puts every local gear setup on MongoDB Atlas
 * @returns {Promise<void>}
 */
async function UpdateAllSetups() {
    // Get the name of every boss directory containing their respective gear sets
    let tempArray = fs.readdirSync(path.resolve(__dirname, "../Setups"));
    let dirArray = [] // Holds the name of each boss directory
    for (let i = 0; i < tempArray.length; i++) {
        if (!tempArray[i].includes(".")) {
            dirArray.push(tempArray[i])
        }
    }
    let setups = {}
    // Look at each boss directory and add JSON files to setupsArray
    dirArray.forEach((bossDir) => {
        let setupsArray = fs.readdirSync(path.resolve(__dirname, "../Setups/"+bossDir));
        // Add each gear setup to the database
        setupsArray.forEach(async (file) => {
            const setup = require("../Setups/"+bossDir+"/"+file);
            // User the setup name as the key
            setups[setup.name] = setup;
            setups.size += 1;
            await addToGearSetups(bossDir, setup);
        });
    });
    await closeConnection();
}

/**
 * Adds a user's RSN to the RSNList collection
 * @param discordId Unique discord ID
 * @param userRSN The user's in-game osrs name
 * @param skillsJSON The user's skills as a JSON object
 * @returns {Promise<void>}
 */
async function addToRSNList(discordId, userRSN, skillsJSON) {
    const database = await connectToDB();
    const collection = database.collection(dbCollections.RSN_LIST);
    // Search for boss name (_id) and the setups[i].name that matches setupJSON.name
    const query = { "_id": discordId, "authorRSN": userRSN };
    // Update the existing entry with the new one
    const update = { "$set": { "skills": skillsJSON } };
    const options = { "upsert": true }; // Creates a new JSON object if it does not exist
    try {
        // Check if the _id exists in the collection, if not then create it
        const checkIdExists = await collection.findOne( { "_id": discordId } )
        if (checkIdExists === null) { // If it does not exist
            await collection.insertOne(
                { "_id": discordId, "skills": skillsJSON }
            );
            return logger.logDB(`Created new RSN ${userRSN} for ${discordId}`);
        }
        else {
            // If the _id exists, attempt to update it
            const updateResult = await collection.updateOne(query, update);
            if (updateResult.modifiedCount === 0) { // If no update was made
                return logger.logDB(`Updated RSN ${userRSN} for ${discordId}`);
            }
        }
    } catch (err) {
        logger.logDB(`**ERROR ADDING ${userRSN} TO RSNLIST COLLECTION:** ` + err);
    }
}

/**
 * Adds a setup to the given boss (key) in GearSetups collection.
 * @param bossName The name of the boss is the key in the GearSetups collection
 * @param setupJSON The JSON setup to add
 * @returns {Promise<void>}
 */
async function addToGearSetups(bossName, setupJSON) {
    const database = await connectToDB();
    const collection = database.collection(dbCollections.GEAR_SETUPS);
    // Search for boss name (_id) and the setups[i].name that matches setupJSON.name
    const query = { "_id": bossName, "setups.name": setupJSON.name };
    // Update the existing entry with the new one
    const update = { "$set": { "setups.$": setupJSON } };
    const options = { "upsert": true }; // Creates a new JSON object if it does not exist
    try {
        // Check if the _id exists in the collection, if not then create it
        const checkIdExists = await collection.findOne( { "_id": bossName } )
        if (checkIdExists === null) {
            await collection.insertOne(
                { "_id": bossName, "setups": [setupJSON] }
            );
            return logger.logDB(`Created new boss ${bossName}`);
        }
        // This returns null if the _id AND setup was not found
        const response = await collection.findOne( { "_id": bossName, "setups.name": setupJSON.name} )
        if (response === null) { // If it was not found
            // This only updates if the _id exists!!
            await collection.updateOne(
                {"_id": bossName},
                { $push: { "setups": setupJSON } }
            );
            return logger.logDB(`Gear set ${setupJSON.name} added to ${bossName}`);
        }
        else {
            // If the _id and setup.name exists, attempt to update it
            const updateResult = await collection.updateOne(query, update);
            if (updateResult.modifiedCount === 0) { // If no update was made
                return logger.logDB(`Updated gear set ${setupJSON.name} for ${bossName}`);
            }
        }
    } catch (err) {
        logger.logDB(`**ERROR ADDING ${setupJSON.name} TO GEARSETUPS COLLECTION:** ` + err);
    }
}

/**
 * Helper function for closing connection.
 * @returns {Promise<void>}
 */
async function closeConnection() {
    try {
        await mongoClient.close();
        logger.logDB("Success closing connection");
    } catch (err) {
        logger.logDB("**ERROR CLOSING CONNECTION**: " + err);
    }
}

/**
 * Helper function for connecting to the DB and returns the database object.
 * @returns {Promise<Db>}
 */
async function connectToDB() {
    try {
        // Create the connection using credentials in .env and log events using logger
        await mongoClient.connect();
        logger.logDB("Connected to database.")

        // If the DB Boss Gear Bot does not exist, it will create it
        return mongoClient.db("BossGearBotDB");
        //const collection = database.collection("GearSetups");
    } catch (err) {
        logger.logDB("**DATABASE ERROR**: " + err)
    }
}

//UpdateAllSetups();

module.exports = {
    dbCollections,
    addToGearSetups,
    addToRSNList
}