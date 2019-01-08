const myTools = require("../Helpers/myTools");
const Discord = require("discord.js");
const footerIcon = "warframeLogo.jpg";
const color = "#F04747";
const fissureImage =
  "https://vignette.wikia.nocookie.net/warframe/images/5/57/VoidTearIcon_b.png/revision/latest?cb=20160713085454";

let makeEmbed = worldstate => {
  let embed = new Discord.RichEmbed()
    .setTitle("[PC] Fissures")
    .setDescription("Currently active Fissures")
    .setColor(color)
    .setFooter("Sent", `attachment://${footerIcon}`)
    .setThumbnail(fissureImage)
    .setTimestamp();
  let { fissures } = worldstate;
  fissures.forEach(fissure => {
    let { expired } = fissure;
    if (!expired) {
      let { tier, enemy, missionType, node, eta } = fissure;
      embed.addField(
        `${tier} ${enemy} ${missionType}`,
        `${node} [${eta}]`,
        true
      );
    }
  });
  return {
    embed,
    files: [{ attachment: `images/${footerIcon}` }]
  };
};

module.exports.run = (bot, message, args) => {
  let worldstate = myTools.updateWorldState().then(worldstate => {
    let embed = makeEmbed(worldstate);
    message.channel.send(embed);
  });
};

module.exports.help = {
  name: "fissures",
  variants: [
    {
      title: "Current Fissure missions!",
      add: ""
    }
  ]
};
