const player = require("../Players/Hiscores");

module.exports = {
    name: "setrsn",
    description: "Attaches the given rsn to the discord user ID",
    async execute(message, args) {
        const playerName = args.join(" ");
        message.channel.send(`Fetching information for ${playerName}...`)
        await player.createPlayer(message, playerName);
        message.reply(`Successfully set your RSN to ${playerName}`);
    }
}