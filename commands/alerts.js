const myTools = require("../Helpers/myTools");
const Discord = require("discord.js");
const footerIcon = "warframeLogo.jpg";

let makeEmbed = (pos, wordlstate) => {
  let alert = worldstate.alerts[pos];

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
        `/${worldstate.alerts.length} \u2022 ${
          alert.eta
        } remaining \u2022 Exiers after 60s`,
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
};

module.exports.run = (bot, message, args) => {
  myTools.updateWorldState().then(worldstate => {
    let pos = 0;
    botID = bot.user.id;
    let embed = makeEmbed(pos, worldstate);
    message.channel.send(embed).then(sentMsg => {
      //Add nav reactions
      sentMsg.react("⏮").then(() => {
        sentMsg.react("◀").then(() => {
          sentMsg.react("▶").then(() => {
            sentMsg.react("⏭").then(() => {
              const filter = (reaction, user) => {
                let { name } = reaction.emoji;
                return (
                  (name === "⏮" ||
                    name === "◀" ||
                    name === "▶" ||
                    name === "⏭") &&
                  user.id != botID
                );
              };
              const collector = sentMsg.createReactionCollector(filter, {
                time: 30000
              });
              collector.on("collect", reaction => {
                let { name } = reaction.emoji;
                if (name === "⏮") pos = 0;
                else if (name === "◀") pos -= pos > 0 ? -1 : 0;
                else if (name === "▶")
                  pos += pos < worldstate.alerts.length - 1 ? 1 : 0;
                else if (name === "⏭") pos = worldstate.alerts.length - 1;
                let embed = makeEmbed(pos, worldstate);
                sentMsg.edit({
                  embed,
                  files: [{ attachment: `images/${footerIcon}` }]
                });
                reaction.remove(message.author);
              });
              collector.on("end", collected => {});
            });
          });
        });
      });
    });
  });
};

module.exports.help = {
  name: "alerts",
  title: "List current Alerts!",
  add: ""
};
