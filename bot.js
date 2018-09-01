const botSettings = require("./botSettings.json");
const Discord = require("discord.js");
const prefix = botSettings.prefix;
const bot = new Discord.Client({ disableEveryone: true });
const moment = require("moment");

bot.on("ready", async () => {
  console.log(`Bot is ready! Username: ${bot.user.username}`);

  bot
    .generateInvite(["ADMINISTRATOR"])
    .then(link => {
      console.log(link);
    })
    .catch(error => {
      console.log(error.stack);
    });
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (!command.startsWith(prefix)) return;

  if (command === `${prefix}userinfo`) {
    let embed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setDescription("This is the user's info!")
      .setColor("#9B39B6")
      .addField(
        "Full Username",
        `${message.author.username}#${message.author.discriminator}`
      )
      .addField("ID", message.author.id)
      .addField(
        "Created",
        moment(
          message.author.createdAt,
          "ddd MMM DD YYYY HH:mm:ss GMT+-HHmm"
        ).format("dddd, MMMM Do YYYY.")
      );
    message.channel.sendEmbed(embed);
    return;
  }
});

bot.login(botSettings.token);
