const Discord = require("discord.js");
const myTools = require("./myTools");
const footerIcon =
  "https://community.gophersvids.com/uploads/monthly_2015_07/Warframe_Logo_v1.png.66fa77f0af4dadc0b1a269016e9ab36a.png";

async function alertEmbed(pos, worldState) {
  let alert = worldState.alerts[pos];

  //Gets alert title
  let str = alert.mission.reward.asString;
  let inds = str.indexOf("+");
  let trueRew = inds > -1 ? str.substring(0, inds - 1) : str;

  let embed = new Discord.RichEmbed()
    .setColor(myTools.rbgIntToRgb(alert.mission.reward.color))
    .setThumbnail(alert.mission.reward.thumbnail)
    .setTitle("[PC] " + trueRew)
    .addField("Mission", alert.mission.faction + " " + alert.mission.type, true)
    .addField("Loaction", alert.mission.node, true)
    .addField(
      "Level",
      `${alert.mission.minEnemyLevel} - ${alert.mission.maxEnemyLevel}`,
      true
    )
    .addField(
      "Archwing Required: ",
      alert.mission.archwingRequired ? "Yes" : "No",
      true
    )
    .setFooter(
      "Page " +
        `${parseInt(pos) + 1}` +
        `/${worldState.alerts.length} \u2022 ${
          alert.eta
        } remaining \u2022 Exiers after 60s`,
      footerIcon
    )
    .setTimestamp();

  if (!trueRew.startsWith(`${alert.mission.reward.credits}`)) {
    embed.addField("\u200B", `**Credits: ** ${alert.mission.reward.credits}`);
  }
  return embed;
}

async function invasionEmbed(worldState) {
  let embed = new Discord.RichEmbed();
  console.log(Object.keys(worldState));
}

module.exports = {
  alertEmbed,
  invasionEmbed
};
