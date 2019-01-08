const Discord = require("discord.js");
const myTools = require("../Helpers/myTools");
const footerIcon = "warframeLogo.jpg";
const color = "#F04747";

let makeEmbed = worldstate => {
  let { voidTrader } = worldstate;
  let embed = new Discord.RichEmbed()
    .setTitle("Void Trader")
    .setColor(color)
    .setFooter("Sent", `attachment://${footerIcon}`)
    .setThumbnail("http://i.imgur.com/z0wU29P.png")
    .setTimestamp();
  let { active, startString, location } = voidTrader;
  if (active) {
    embed.addField(`Landing in: ${startString}`);
    return embed;
  }
  let { inventory, endString } = voidTrader;
  inventory.forEach(relic => {
    let { item, ducats, credits } = relic;
    embed.addField(item, `${ducats} Ducats + ${credits} Credits`, true);
  });
  embed.addField(`Time left in ${location}: `, endString);
  return { embed, files: [{ attachment: `images/${footerIcon}` }] };
};

module.exports.run = (bot, message, args) => {
  myTools.updateWorldState().then(worldsate => {
    let embed = makeEmbed(worldstate);
    message.channel.send(embed);
  });
};

module.exports.help = {
  name: "trader",
  variants: [
    {
      title: "Shows Baro Ki'Teer's items!",
      add: ""
    }
  ]
};
