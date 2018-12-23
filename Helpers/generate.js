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

async function invasionEmbed(worldState) {
  let invasions = worldState.invasions;
  let embed = new Discord.RichEmbed()
    .setTitle("[PC] Invasions")
    .setDescription("Currently in progress:")
    .setColor(color)
    .setThumbnail("https://i.imgur.com/QUPS0ql.png")
    .setFooter("Sent", footerIcon)
    .setTimestamp();
  for (let i = 0; i < invasions.length; i++) {
    let invasion = invasions[i];
    if (invasion.completion < 0 || invasion.completion > 100) continue;
    let fName, fDesc;
    fDesc = fDesc = `${invasion.desc} on ${invasion.node} - ETA ${
      invasion.eta
    }`;
    if (!invasion.vsInfestation) {
      fName = `${invasion.attackerReward.itemString} vs ${
        invasion.defenderReward
      }`;
    } else {
      fName = `${invasion.defenderReward.itemString}`;
    }
    fName = `${fName}- ${invasion.completion.toFixed(2)}%`;
    embed.addField(fName, fDesc);
  }

  return embed;
}

async function sortieEmbed(worldState) {
  let sortie = worldState.sortie;
  let embed = new Discord.RichEmbed()
    .setTitle("[PC] Sortie")
    .setDescription(`Agianst: ${sortie.faction} - **${sortie.boss}**`)
    .setColor(color)
    .setThumbnail(
      "https://vignette.wikia.nocookie.net/warframe/images/1/15/Sortie_b.png/revision/latest?cb=20151217134250"
    )
    .setFooter(`${sortie.eta} remaining`, footerIcon)
    .setTimestamp();
  for (let mission of sortie.variants) {
    embed.addField(
      `${mission.node} - ${mission.missionType}`,
      `${mission.modifier}`
    );
  }
  return embed;
}

async function fissuresEmbed(worldState) {
  let embed = new Discord.RichEmbed()
    .setTitle("[PC] Fissures")
    .setDescription("Currently active Fissures")
    .setColor(color)
    .setFooter("Sent", footerIcon)
    .setThumbnail(
      "https://vignette.wikia.nocookie.net/warframe/images/5/57/VoidTearIcon_b.png/revision/latest?cb=20160713085454"
    )
    .setTimestamp();
  for (let fissure of worldState.fissures) {
    if (!fissure.expired)
      embed.addField(
        `${fissure.tier} ${fissure.enemy} ${fissure.missionType}`,
        `${fissure.node} [${fissure.eta}]`
      );
  }
  return embed;
}

async function BaroEmbed(worldState) {
  let baro = worldState.voidTrader;
  let embed = new Discord.RichEmbed()
    .setTitle("Void Trader")
    .setColor(color)
    .setFooter("Sent", footerIcon)
    .setTimestamp()
    .setThumbnail("http://i.imgur.com/z0wU29P.png");
  if (!baro.active) {
    embed.addField(`Landing in: ${baro.startString}`);
  } else {
    for (let thing of baro.inventory) {
      embed.addField(
        thing.item,
        `${thing.ducats} Ducats + ${thing.credits} credits`,
        true
      );
    }
    embed.addField(`Time left in ${baro.location}: `, baro.endString);
  }
  return embed;
}

module.exports = {
  userEmbed,
  invasionEmbed,
  sortieEmbed,
  fissuresEmbed,
  BaroEmbed
};
