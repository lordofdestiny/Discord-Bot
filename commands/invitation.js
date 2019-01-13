const axios = require("axios");
const isgd = require("isgd");

module.exports.run = (bot, message, args) => {
  bot
    .generateInvite(["ADMINISTRATOR"])
    .then(link => {
      isgd.shorten(link, res => {
        message.channel.send(`This is the invte link: **${res}**`);
      });
    })
    .catch(error => {
      console.log(error.stack);
    });
};

module.exports.help = {
  name: "invitation",
  variants: [
    {
      title: `Generates invitation link for this Bot to join server!`,
      add: ""
    }
  ]
};
