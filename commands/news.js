const myTools = require("../Helpers/myTools");
const Discord = require("discord.js");
const footerIcon = "warframeLogo.jpg";
const moment = require("moment");

let filterEnglishNews = news => {
  let filtered = news.filter(value => {
    return value.translations.en != undefined;
  });

  return filtered.reverse();
};

let formatDate = date => {
  return moment(date).format("MMMM Do YYYY, HH:mm");
};

let newsColor = news => {
  let color = "#F04747";
  let { update, primeAccess, stream } = news;
  if (update) color = "#19B5FE";
  if (primeAccess) color = "#FFA400";
  if (stream) color = "#875F9A";
  return color;
};

let makeEmbed = (pos, news) => {
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
      `Page ${pos + 1}/${news.length} ${priority ? " | Important!" : ""}`,
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
    files: [{ attachment: `images/${footerIcon}` }]
  };
};

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
