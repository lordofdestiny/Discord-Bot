const Discord = require("discord.js");
const fs = require("fs");
const dragon = "botAvatar.png";
const { prefix } = process.env;
const color = "#F04747";

let listFunctions = () => {
  return new Promise((resolve, reject) => {
    let commands = new Map();
    fs.readdir(__dirname, (err, files) => {
      files.filter(f => f.split(".").pop() == "js");
      files.forEach((file, i) => {
        if (file != "help.js") {
          let props = require(`./${file}`);
          commands.set(props.help.name, {
            note: props.help.title,
            add: props.help.add
          });
        }
      });
      resolve(commands);
    });
  }).catch(err => {
    reject(err);
  });
};

module.exports.run = (bot, message, args) => {
  let embed = new Discord.RichEmbed()
    .setTitle("Command list")
    .setColor(color)
    .setThumbnail(`attachment://${dragon}`)
    .setTimestamp()
    .setFooter("* Denotes optional parameter", `attachment://${dragon}`);
  listFunctions()
    .then(commands => {
      commands.forEach((value, key) => {
        embed.addField(
          value.note,
          "```" + `${prefix}${key}` + ` ${value.add}` + "```"
        );
      });
    })
    .then(() => {
      message.channel.send({
        embed,
        files: [{ attachment: `images/${dragon}` }]
      });
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports.help = {
  name: "help",
  title: "",
  add: ""
};
