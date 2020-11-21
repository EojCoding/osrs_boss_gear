const responses = require("../Setups/Responses");
const player = require("../Players/Player");
const RSNList = require("../Players/RSNList.json");
const bossinfo = require("../Setups/bossinfo.json");

// Export JSON
module.exports = {
    name: "mybosslist",
    description: "Shows a list of bosses the player can do for the given budget and stats",
    async execute(client, message) {
        // First check that they have set their rsn
        // If they have not, then tell them to do so
        if (!RSNList.hasOwnProperty(message.author.id)) {
            message.reply("You must first set your rsn using `~setrsn your-rsn-here`");
            return;
        }
        const withoutPrefix = message.content.slice(1);
        const split = withoutPrefix.split(/ +/);
        if (split.length < 2) {
            message.channel.send("You must provide a budget/");
            return;
        }
        const budget = split[1];

        // This should always return true since the check is made above to verify it exists.
        const playerCharacter = await player.getPlayer(message.author.id);
        console.log(playerCharacter);
        // Then get a list of all bosses which are compatible with the player stats
        // And compare the stats with the player stats
        let acceptedKeys = new Map();
        Object.keys(bossinfo).forEach((key) => {
            // Add the boss key to a map of tentatively accepted keys
            acceptedKeys.set(key, bossinfo[key]);
            const bossMinStats = bossinfo[key].minstats;
            Object.keys(playerCharacter).forEach((skill) => {
                if (bossMinStats.hasOwnProperty(skill)) {
                    // If the min boss stat req is higher than the players AND the map has the key still
                    // then remove it
                    if (bossMinStats[skill] > playerCharacter[skill].level && acceptedKeys.has(key)) {
                        acceptedKeys.delete(key);
                        //message.channel.send("Your " + skill + " level is not high enough for " + key);
                    }
                }
            });
        });
        if (acceptedKeys.size < 1) {
            message.channel.send("You do not meet the minimum required stats for any boss");
            return;
        }
        responses.myBossList(acceptedKeys, message, budget, client);
    }
}