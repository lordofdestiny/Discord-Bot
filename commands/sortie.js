const myTools = require("../Helpers/myTools");
const Discord = require("discord.js");
const footerIcon = "warframeLogo.jpg";
const sortieIcon =
  "https://vignette.wikia.nocookie.net/warframe/images/1/15/Sortie_b.png/revision/latest?cb=20151217134250";
const color = "#F04747";

let makeEmbed = worldsate => {
  let { sortie } = worldstate;
  let { faction, boss, eta } = sortie;
  let embed = new Discord.RichEmbed()
    .setTitle("[PC] Sortie")
    .setDescription(`Agianst: ${faction} - **${boss}**`)
    .setColor(color)
    .setThumbnail(sortieIcon)
    .setFooter(`${eta} remaining`, `attachment://${footerIcon}`)
    .setTimestamp();
  sortie.variants.forEach(mission => {
    let { node, missionType, modifier } = mission;
    embed.addField(`${node} - ${missionType}`, `${modifier}`);
  });

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
  name: "sortie",
  variants: [
    {
      title: "Current Sortie missions!",
      add: ""
    }
  ]
};
