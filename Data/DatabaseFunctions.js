require("dotenv/config");
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(process.env.DB_CONNECTION, { useUnifiedTopology: true });
const logger = require("../Logs/Logger");
// Collection constants
const dbCollections = {
    GEAR_SETUPS: "GearSetups",
    BOSS_INFO: "BossInfo",
    RSN_LIST: "RSNList",
    EQUIPMENT: "Equipment"
}

const testSetup1 = require("../Setups/dks/1.json");
const testSetup2 = require("../Setups/dks/2.json");

async function testFunc() {
    await addToGearSetups("dks", testSetup1);
    await addToGearSetups("dks", testSetup2);
    await closeConnection();
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
    try {
        const modifiedJSON = {
            _id: "dks",
            setups: [setupJSON]
        }
        // Add the setup to the DB in GearSetups collection
        await collection.insertOne(modifiedJSON);
        logger.logDB("Added setup");
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

testFunc();

module.exports = {
    dbCollections
}