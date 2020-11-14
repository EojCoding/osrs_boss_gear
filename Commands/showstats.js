const player = require("../Players/Hiscores");

module.exports = {
    name: "showstats",
    description: "Shows stats of the person who used the command",
    async execute(message, args, client) {
        await player.displayStats(message, client);
    }
}