const myTools = require("../Helpers/myTools");
const Discord = require("discord.js");
const footerIcon = "warframeLogo.jpg";
const invasionsImage = "https://i.imgur.com/QUPS0ql.png";
const color = "#F04747";

let makeEmbed = worldstate => {
  let invasions = worldstate.invasions;
  let embed = new Discord.RichEmbed()
    .setTitle("[PC] Invasions")
    .setDescription("Currently in progress:")
    .setColor(color)
    .setThumbnail(invasionsImage)
    .setFooter("Sent", `attachment://${footerIcon}`)
    .setTimestamp();

  for (let i = 0; i < invasions.length; i++) {
    let {
      desc,
      node,
      eta,
      completion,
      attackerReward,
      defenderReward,
      vsInfestation
    } = invasions[i];
    if (completion < 0 || completion > 100) continue;
    let fDesc = `${desc} on ${node} - ETA ${eta}`;
    let fName;
    if (!vsInfestation)
      fName = `${attackerReward.itemString} vs ${defenderReward}`;
    else fName = `${defenderReward.itemString}`;
    fName = `${fName}- ${completion.toFixed(2)}%`;
    embed.addField(fName, fDesc);
  }

  return {
    embed,
    files: [{ attachment: `images/${footerIcon}` }]
  };
};

module.exports.run = (bot, message, args) => {
  myTools.updateWorldState().then(worldstate => {
    let embed = makeEmbed(worldstate);
    message.channel.send(embed);
  });
};

module.exports.help = {
  name: "invasions",
  variants: [{ title: "List current Invasions!", add: "" }]
};
