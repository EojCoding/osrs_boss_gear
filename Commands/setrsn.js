const player = require("../Players/Hiscores");

module.exports = {
    name: "setrsn",
    description: "Attaches the given rsn to the discord user ID",
    async execute(message, args) {
        // The given args should just contain the rsn they want to set
        await player.createPlayer(message, args);
    }
}