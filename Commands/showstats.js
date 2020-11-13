const player = require("../Players/Hiscores");

module.exports = {
    name: "showstats",
    description: "Shows stats of the person who used the command",
    async execute(message, args) {
        const playerName = args.join(" ");
        await player.displayStats(message, playerName);
    }
}