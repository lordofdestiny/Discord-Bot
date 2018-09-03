require("dotenv").config();

const Discord = require("discord.js");
const moment = require("moment");
const myTools = require("./myTools");
const axios = require("axios");
const WarframeVersion = require("warframe-updates");
const warframeVersion = new WarframeVersion();
const WorldState = require("warframe-worldstate-parser");
const bot = new Discord.Client({ disableEveryone: true });
let worldState;

const prefix = process.env.prefix;

const commands = {
  // userinfo: {
  //   info: "Get your info:",
  //   add: ""
  // },
  talk: {
    info: "Bot says what you tell him to:",
    add: "<text> (tts)"
  },
  joke: {
    info: "Bot tells you a joke: ",
    add: "(tts)"
  },
  didThanosKillMe: {
    info: "Tells you if Thanos killed you with his snap",
    add: "(tts)"
  },
  update: {
    info: "Gives you info on lates Warframe update!",
    add: ""
  },
  alerts: {
    info: "Gives you list of currsnt alerts!",
    add: ""
  }
};

const color = "#F04747";

const dragonThumbnail =
  "https://orig00.deviantart.net/2d14/f/2014/206/8/3/dragon_portrait_by_aazure_dragon-d7s7qqi.png";

const footerIcon =
  "https://community.gophersvids.com/uploads/monthly_2015_07/Warframe_Logo_v1.png.66fa77f0af4dadc0b1a269016e9ab36a.png";

bot.on("ready", async () => {
  bot
    .generateInvite(["ADMINISTRATOR"])
    .then(link => {
      console.log(link);
    })
    .catch(error => {
      console.log(error.stack);
    });
  updateWorldState();
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (!command.startsWith(prefix)) {
    return;
  }

  if (command === `${prefix}help`) {
    //If user asks for help
    let embed = new Discord.RichEmbed()
      .setTitle("Command list")
      .setColor(color)
      .setThumbnail(
        "https://orig00.deviantart.net/2d14/f/2014/206/8/3/dragon_portrait_by_aazure_dragon-d7s7qqi.png"
      );
    Object.keys(commands).forEach(key => {
      embed.addField(
        commands[key].info,
        "```" + `${prefix}${key}` + ` ${commands[key].add}` + "```"
      );
    });
    message.channel.send(embed);
    return;
  }

  if (!(command.slice(1) in commands)) {
    //if users enters unexisting command
    message.reply(
      `Unknown command! To get list of commands type ${prefix}help`
    );
    return;
  }

  // if (command === `${prefix}userinfo`) {
  //   //if user aks for his info
  //   let embed = new Discord.RichEmbed()
  //     .setAuthor(message.author.username)
  //     .setDescription(`This is the ${message.author.username}'s info!`)
  //     .setColor(color)
  //     .setThumbnail(message.author.avatarURL)
  //     .addField(
  //       "Full Username",
  //       `${message.author.username}#${message.author.discriminator}`
  //     )
  //     .addField("ID", message.author.id)
  //     .addField(
  //       "Created At",
  //       moment(
  //         message.author.createdAt,
  //         "ddd MMM DD YYYY HH:mm:ss GMT+-HHmm"
  //       ).format("dddd, MMMM Do YYYY.")
  //     );
  //   message.channel.send(embed);
  //   return;
  // }

  if (command === `${prefix}talk`) {
    myTools.deleteMessage(message);
    let rest = message.content.slice(command.length).replace(" tts", "");
    let doTts = args[args.length - 1] === "tts";
    message.channel.send(`${rest}`, { tts: `${doTts}` });
    return;
  }

  if (command === `${prefix}didThanosKillMe`) {
    let doTts = args[args.length - 1] === "tts";
    message.reply(`${myTools.snap()}`, {
      tts: `${doTts}`
    });
    return;
  }

  if (command === `${prefix}joke`) {
    myTools.deleteMessage(message);
    let doTts = args[args.length - 1] === "tts";
    axios
      .get("http://api.icndb.com/jokes/random")
      .then(res => {
        let joke = res.data.value.joke;
        message.channel.send(`${joke.split("&quot;").join('"')}`, {
          tts: `${doTts}`
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
    if (update.version !== "") embed.addField("Version", update.version);
    message.channel.send(embed);
  }

  if (command == `${prefix}alerts`) {
    console.log("awaiting!");
    await updateWorldState();
    console.log("done!");
    let pos = 0;
    let embed = generateAlertEmbed(pos);
    message.channel.send(embed).then(async sentMessage => {
      await sentMessage.react("⏮");
      await sentMessage.react("◀");
      await sentMessage.react("▶");
      await sentMessage.react("⏭");
      const filter = (
        //check only for those emoji's
        reaction,
        user
      ) =>
        (reaction.emoji.name === "⏮" ||
          reaction.emoji.name === "◀" ||
          reaction.emoji.name === "▶" ||
          reaction.emoji.name === "⏭") &&
        user.id != bot.user.id;
      const collector = await sentMessage.createReactionCollector(filter, {
        time: 60000
      });
      collector.on("collect", async reaction => {
        let name = reaction.emoji.name;
        if (name === "⏮") {
          sentMessage.edit(generateAlertEmbed(0));
        } else if (name === "◀") {
          if (pos > 0) {
            pos--;
            sentMessage.edit(generateAlertEmbed(pos));
          }
        } else if (name === "▶") {
          pos++;
          sentMessage.edit(generateAlertEmbed(pos));
        } else if (name === "⏭") {
          pos = worldState.alerts.length - 1;
          sentMessage.edit(generateAlertEmbed(pos));
        }
        reaction.remove(message.author);
      });
      collector.on("end", collected => {});
    });
    return;
  }
});

async function updateWorldState() {
  axios
    .get("http://content.warframe.com/dynamic/worldState.php")
    .then(res => {
      worldState = new WorldState(JSON.stringify(res.data));
    })
    .catch(error => {
      console.log(error);
    });
}

generateAlertEmbed = pos => {
  let alert = worldState.alerts[pos];

  //Gets alert title
  let str = alert.mission.reward.asString;
  let inds = str.indexOf("+");
  let trueRew = inds > -1 ? str.substring(0, inds - 1) : str;

  let embed = new Discord.RichEmbed()
    .setColor(myTools.rbgIntToRgb(alert.mission.reward.color))
    .setThumbnail(alert.mission.reward.thumbnail)
    .setTitle("[PC] " + trueRew)
    .addField("Mission", alert.mission.faction + " " + alert.mission.type, true)
    .addField("Loaction", alert.mission.node, true)
    .addField(
      "Level",
      `${alert.mission.minEnemyLevel} - ${alert.mission.maxEnemyLevel}`,
      true
    )
    .addField(
      "Archwing Required: ",
      alert.mission.archwingRequired ? "Yes" : "No",
      true
    )
    .setFooter(
      "Page " +
        `${parseInt(pos) + 1}` +
        `/${worldState.alerts.length} \u2022 ${
          alert.eta
        } remaining \u2022 Exiers after 60s`,
      footerIcon
    )
    .setTimestamp();
  if (!trueRew.startsWith(`${alert.mission.reward.credits}`)) {
    embed.addField("\u200B", `**Credits: ** ${alert.mission.reward.credits}`);
  }
  return embed;
};

bot.login(process.env.token);
