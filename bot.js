const botSettings = require("./botSettings.json");
const Discord = require("discord.js");
const moment = require("moment");
const myTools = require("./myTools");
const axios = require("axios");
const WarframeVersion = require("warframe-updates");
const warframeVersion = new WarframeVersion();
const bot = new Discord.Client({ disableEveryone: true });

const prefix = botSettings.prefix || process.env.token;

const commands = {
  userinfo: "Get your info:",
  talk: "Bot says what you tell him to:",
  joke: "Bot tells you a joke: ",
  didThanosKillMe: "Tells you if Thanos killed you with his snap",
  update: "Gives you lates update info!"
};

const commandFormat = {
  userinfo: "",
  talk: "<text> <tts>",
  joke: "<tts>",
  didThanosKillMe: "",
  update: ""
};

const color = "#F04747";

const dragonThumbnail =
  "https://orig00.deviantart.net/2d14/f/2014/206/8/3/dragon_portrait_by_aazure_dragon-d7s7qqi.png";

bot.on("ready", async () => {
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

  console.log(command);

  if (!command.startsWith(prefix)) {
    return;
  }

  if (command === `${prefix}help`) {
    //If user asks for help
    let embed = new Discord.RichEmbed()
      .setAuthor("Command list:")
      .setColor(color)
      .setThumbnail(
        "https://orig00.deviantart.net/2d14/f/2014/206/8/3/dragon_portrait_by_aazure_dragon-d7s7qqi.png"
      );
    Object.keys(commands).forEach(key => {
      embed.addField(commands[key], "```" + `${prefix}${key}` + "```");
    });
    message.channel.send(embed);
    return;
  }

  if (!(command.slice(1) in commands)) {
    //if users enters unexisting command
    message.channel.send(
      `<@${
        message.author.id
      }> Unknown command! To get list of commands type ${prefix}help`
    );
    return;
  }

  if (command === `${prefix}userinfo`) {
    //if user aks for his info
    let embed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setDescription(`This is the ${message.author.username}'s info!`)
      .setColor(color)
      .setThumbnail(message.author.avatarURL)
      .addField(
        "Full Username",
        `${message.author.username}#${message.author.discriminator}`
      )
      .addField("ID", message.author.id)
      .addField(
        "Created At",
        moment(
          message.author.createdAt,
          "ddd MMM DD YYYY HH:mm:ss GMT+-HHmm"
        ).format("dddd, MMMM Do YYYY.")
      );
    message.channel.send(embed);
    return;
  }

  if (command === `${prefix}talk`) {
    myTools.deleteMessage(message);
    let rest = message.content.slice(command.length).replace(" tts", "");
    let doTts = args[args.length - 1] === "tts";
    message.channel.send(`${rest}`, { tts: `${doTts}` });
    return;
  }

  if (command === `${prefix}didThanosKillMe`) {
    message.channel.send(myTools.snap());
    return;
  }

  if (command === `${prefix}joke`) {
    axios
      .get("http://api.icndb.com/jokes/random")
      .then(res => {
        let joke = res.data.value.joke;
        message.channel.send(`${joke.split("&quot;").join('"')}`, {
          tts: true
        });
      })
      .catch(error => {
        console.log(error.stack);
      });
    return;
  }

  if (command === `${prefix}update`) {
    let update = warframeVersion;
    let embed = new Discord.RichEmbed()
      .setAuthor(update.title)
      .setDescription(update.link)
      .setImage(update.image)
      .setColor(color)
      .addField(
        "Date released: ",
        moment(message.author.createdAt, "YYYY-MM-DDTHH:mm:ss.000Z").format(
          "dddd, MMMM Do YYYY. HH:mm:ss"
        )
      )
      .setThumbnail(
        "https://www.bleedingcool.com/wp-content/uploads/2017/12/warframe-Logo.jpg"
      );
    console.log(update.version);
    if (update.version !== "") embed.addField("Version", update.version);
    message.channel.send(embed);
  }
});

bot.login(process.env.token || botSettings.token);
