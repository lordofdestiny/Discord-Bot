const myTools = require("../Helpers/myTools");
const Discord = require("discord.js");
const footerIcon = "warframeLogo.jpg";
const moment = require("moment");

function filterEnglishNews(news) {
  let filtered = news.filter(value => {
    return value.translations.en != undefined;
  });

  return filtered.reverse();
}

function formatDate(date) {
  return moment(date).format("MMMM Do YYYY, HH:mm");
}

function newsColor(news) {
  let color = "#F04747";
  let { update, primeAccess, stream } = news;
  if (update) color = "#19B5FE";
  if (primeAccess) color = "#FFA400";
  if (stream) color = "#875F9A";
  return color;
}

function makeEmbed(pos, news, duration, expired) {
  let {
    priority,
    link,
    imageLink,
    date,
    startDate,
    endDate,
    eta,
    translations
  } = news[pos];
  let color = newsColor(news[pos]);
  let embed = new Discord.RichEmbed()
    .setColor(color)
    .setURL(link)
    .setTitle(translations.en)
    .setImage(imageLink)
    .setFooter(
      `Page ${pos + 1}/${news.length} • ${
        expired ? "Expired" : `Expires in ${Math.round(duration / 1000)}s`
      }`,
      `attachment://${footerIcon}`
    );
  if (startDate && endDate) {
    embed
      .addField("Starting: ", formatDate(startDate), true)
      .addField("Ending: ", formatDate(startDate), true);
  } else {
    embed.addField("Date: ", formatDate(startDate));
  }
  return {
    embed,
    files: [
      {
        attachment: `images/${footerIcon}`
      }
    ]
  };
}

module.exports.run = (bot, message, args) => {
  myTools.updateWorldState().then(worldstate => {
    let news = filterEnglishNews(worldstate.news);
    myTools.navigationController(bot, message, news, makeEmbed);
  });
};

module.exports.help = {
  name: "news",
  variants: [
    {
      title: "English Warframe news!",
      add: ""
    }
  ]
};
