const Discord = require("discord.js");
const myTools = require("../Helpers/myTools");
const Events = require("../FakeJson.json");
const footerIcon = "warframeLogo.jpg";
const color = process.env.BOT_COLOR;

function fomorianEmbed(data) {
  /* let { events } = data; //not used because of replacing by fake value*/
  let {
    description,
    node,
    faction,
    victimNode,
    maximumScore,
    rewards
  } = /* events[0] */ Events[0];

  let embed = new Discord.RichEmbed();
  embed
    .setTitle(`[PC]${description}`)
    .setFooter("Sent", `attachment://${footerIcon}`)
    .setTimestamp(Date.now())
    .addField(
      "\u2800",
      `Defend ${victimNode} by attacking ${faction} at ${node}`
    )
    .addField("Reward", `${rewards[0].asString}`)
    .addField("Completion Score", `${maximumScore}`);
  return embed;
}

function makeEmbed(worldstate) {
  let embed;
  let { description } = /* worldstate.events[0] */ Events[0];
  if (description.valueOf() === "Balor Fomorian".valueOf())
    embed = fomorianEmbed(worldstate);
  else if (description.valueOf() === "Ghoul Purge".valueOf()) embed = null;
  else return "Error Occured!";

  embed.setColor(color);

  return {
    embed,
    files: [{ attachment: `images/${footerIcon}` }]
  };
}

module.exports.run = (bot, message, args) => {
  myTools
    .updateWorldState()
    .then(worldstate => {
      let embed = makeEmbed(worldstate);
      message.channel.send(embed);
    })
    .catch(error => {
      console.log(error.stack);
    });
};

module.exports.help = {
  name: "events",
  variants: [
    {
      title: "Ongoing events!",
      add: ""
    }
  ],
  ignore: false
};
