const player = require("../Players/Player");

module.exports = {
    name: "setrsn",
    description: "Attaches the given rsn to the discord user ID",
    async execute(message, args) {
        const playerName = args.join(" ");
        await player.createPlayer(message, playerName);
    }
}