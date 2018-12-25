require("dotenv").config();
const Discord = require("discord.js");
const myTools = require("./myTools");
const moment = require("moment");
const footerIcon =
  "https://community.gophersvids.com/uploads/monthly_2015_07/Warframe_Logo_v1.png.66fa77f0af4dadc0b1a269016e9ab36a.png";
const dragonThumbnail =
  "https://orig00.deviantart.net/2d14/f/2014/206/8/3/dragon_portrait_by_aazure_dragon-d7s7qqi.png";
const color = "#F04747";
const prefix = process.env.prefix;

async function userEmbed(row, user) {
  let level = row.level;
  let points = row.points;
  let embed = new Discord.RichEmbed()
    .setTitle(user.username)
    .setDescription(`${user.tag}`)
    .setThumbnail(user.avatarURL)
    .setColor(color)
    .setFooter("Sent", dragonThumbnail)
    .setTimestamp()
    .addField("Level", level, true)
    .addField("XP", points, true)
    .addField(
      "Acount Created At",
      moment(user.createdAt, "YYYY-MM-DDTHH:mm:ss.000Z").format(
        "dddd, MMMM Do YYYY. HH:mm:ss"
      )
    );
  return embed;
}

module.exports = {
  userEmbed
};
