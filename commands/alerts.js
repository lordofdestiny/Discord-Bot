const myTools = require("../Helpers/myTools");
const Discord = require("discord.js");
const footerIcon = "warframeLogo.jpg";

function makeEmbed(pos, alerts, duration, expired) {
  let alert = alerts[pos];

  //Gets alert title
  let str = alert.mission.reward.asString;
  let index = str.indexOf("+");
  let trueRew = index > -1 ? str.substring(0, index - 1) : str;

  let {
    reward,
    faction,
    type,
    node,
    minEnemyLevel,
    maxEnemyLevel,
    archwingRequired
  } = alert.mission;

  let embed = new Discord.RichEmbed()
    .setColor(myTools.rgbIntToRgb(reward.color))
    .setThumbnail(reward.thumbnail)
    .setTitle("[PC]" + trueRew)
    .addField("Mission", faction + " " + type, true)
    .addField("Location", node, true)
    .addField("Level", `${minEnemyLevel} - ${maxEnemyLevel}`, true)
    .addField("Archwing Required: ", archwingRequired ? "Yes" : "No", true)
    .setFooter(
      "Page " +
        `${parseInt(pos) + 1}` +
        `/${worldstate.alerts.length} • ${alert.eta} remaining • ${
          expired ? "Expired" : `Expires in ${Math.round(duration / 1000)}s`
        }`,
      `attachment://${footerIcon}`
    )
    .setTimestamp();
  if (!trueRew.startsWith(`${reward.credits}`)) {
    embed.addField("\u200B", `**Credits: ** ${reward.credits}`);
  }
  return {
    embed,
    files: [{ attachment: `images/${footerIcon}` }]
  };
}

module.exports.run = (bot, message, args) => {
  myTools.updateWorldState().then(worldstate => {
    let { alerts } = worldstate;
    myTools.navigationController(bot, message, alerts, makeEmbed);
  });
};

module.exports.help = {
  name: "alerts",
  variants: [{ title: "List current Alerts!", add: "" }]
};