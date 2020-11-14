const responses = require("../Setups/Responses");
const player = require("../Players/Player");
const RSNList = require("../Players/RSNList.json");
const bossinfo = require("../Setups/bossinfo.json");

// Export JSON
module.exports = {
    name: "mybosses",
    description: "Shows a list of bosses the player can do for the given budget and stats",
    execute(client, message) {
        // First check that they have set their rsn
        // If they have not, then tell them to do so
        if (!RSNList.hasOwnProperty(message.author.id)) {
            message.reply("You must first set your rsn using `~setrsn your-rsn-here`");
            return;
        }
        const withoutPrefix = message.content.slice(1);
        const split = withoutPrefix.split(/ +/);
        const args = split.slice(1);
        const command = split[0].toLowerCase();
        const budget = split[1];

        // This should always return true since the check is made above to verify it exists.
        const playerCharacter = player.getPlayer(message.author.id).skills;
        // Then get a list of all bosses which are compatible with the player stats
        Object.keys(bossinfo).forEach((key) => {
            const bossMinStats = bossinfo[key].minstats;
            Object.keys(playerCharacter).forEach((skill) => {
                if (bossMinStats.hasOwnProperty(skill)) {
                    if (bossMinStats[skill] > playerCharacter[skill].level) {
                        console.log("Your " + skill + " level is not high enough for " + key);
                    }
                    console.log(skill+" "+playerCharacter[skill].level);
                }
            });
        });

        //responses.response(client, message, budget, boss);
    }
}