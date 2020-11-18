require("dotenv/config");
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(process.env.DB_CONNECTION, { useUnifiedTopology: true });
const logger = require("../Logs/Logger");

async function connectToDB() {
    try {
        // Create the connection using credentials in .env and log events using logger
        await mongoClient.connect();
        logger.logDB("Connected to database.")

        // If the DB Boss Gear Bot does not exist, it will create it
        const database = mongoClient.db("BossGearBotDB");
        // This creates a new collection inside the DB that was created (or exists already)
        const collection = database.collection("GearSetups");
        await collection.insertOne({
            name: "test",
            age: "30 yikes"
        });
        try {
            // This clears the collection
            await database.collection("GearSetups").drop();
            logger.logDB("**DROPPED COLLECTION GearSetups**");
        } catch (err) {
            logger.logDB("**DATABASE ERROR**: " + err);
        }
        // Close the connection once we are done with it.
        await mongoClient.close();
    } catch (err) {
        logger.logDB("**DATABASE ERROR**: " + err)
    }
}

connectToDB();