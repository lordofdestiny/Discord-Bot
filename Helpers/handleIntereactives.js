const generateEmbed = require("./generate");
const Discord = require("discord.js");

async function handleAlerts(message, worldState, botId) {
  let pos = 0;
  let embed = await generateEmbed.alertEmbed(pos, worldState); //Generate alert embed
  message.channel.send(embed).then(async sentMessage => {
    //Add nav reactions
    await sentMessage.react("⏮");
    await sentMessage.react("◀");
    await sentMessage.react("▶");
    await sentMessage.react("⏭");
    const filter = (
      //check only for those emoji's
      reaction,
      user
    ) =>
      (reaction.emoji.name === "⏮" ||
        reaction.emoji.name === "◀" ||
        reaction.emoji.name === "▶" ||
        reaction.emoji.name === "⏭") &&
      user.id != botId;
    const collector = await sentMessage.createReactionCollector(filter, {
      //Create reaction collector for 60s
      time: 60000
    });
    collector.on("collect", async reaction => {
      //Decide on stuff
      let name = reaction.emoji.name;
      if (name === "⏮") {
        pos = 0;
        sentMessage.edit(await generateEmbed.alertEmbed(pos, worldState));
      } else if (name === "◀") {
        if (pos > 0) {
          pos--;
          sentMessage.edit(await generateEmbed.alertEmbed(pos, worldState));
        }
      } else if (name === "▶") {
        if (pos < worldState.alerts.length - 1) pos++;
        sentMessage.edit(await generateEmbed.alertEmbed(pos, worldState));
      } else if (name === "⏭") {
        pos = worldState.alerts.length - 1;
        sentMessage.edit(await generateEmbed.alertEmbed(pos, worldState));
      }
      reaction.remove(message.author);
    });
    collector.on("end", collected => {}); //exit
  });
}

module.exports = {
  handleAlerts
};
