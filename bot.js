require("dotenv").config();
const Discord = require("discord.js");
const moment = require("moment");
const myTools = require("./Helpers/myTools");
const axios = require("axios");
const WarframeVersion = require("warframe-updates");
const warframeVersion = new WarframeVersion();
const generateEmbed = require("./Helpers/generate");
const WorldState = require("warframe-worldstate-parser");
let worldState;

const bot = new Discord.Client({ disableEveryone: true });

const prefix = process.env.prefix;

const dragonThumbnail =
  "https://orig00.deviantart.net/2d14/f/2014/206/8/3/dragon_portrait_by_aazure_dragon-d7s7qqi.png";
const footerIcon =
  "https://community.gophersvids.com/uploads/monthly_2015_07/Warframe_Logo_v1.png.66fa77f0af4dadc0b1a269016e9ab36a.png";
const color = "#F04747";

const commands = {
  talk: {
    info: "Bot says what you tell him to:",
    add: "<text> *tts"
  },
  joke: {
    info: "Bot tells you a joke: ",
    add: "*tts"
  },
  didThanosKillMe: {
    info: "Tells you if Thanos killed you with his snap",
    add: "*tts"
  },
  // update: {
  //   info: "Gives you info on lates Warframe update!",
  //   add: ""
  // },
  alerts: {
    info: "List currsnt Alerts!",
    add: ""
  },
  invasions: {
    info: "List current Invasions!",
    add: ""
  },
  sortie: {
    info: "Current sortie missions!",
    add: ""
  },
  sorry: {
    info: "Fixes sams hate for you!",
    add: ""
  }
};

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

  if (message.isMentioned(bot.user)) {
    message.reply("Don't do that ever again!!!  (╯°□°）╯︵ ┻━┻");
  }

  if (!command.startsWith(prefix)) {
    return;
  }

  if (command === `${prefix}sorry`) {
    message.reply("You saved yourself. ┬─┬ ノ( ゜-゜ノ)");
  }

  if (command === `${prefix}help`) {
    //If user asks for help
    let embed = await generateEmbed.helpEmbed(commands);
    message.channel.send(embed);
    return;
  }

  if (!(command.slice(1) in commands)) {
    //if users enters unexisting command
    message.reply(`¯\\_(ツ)_/¯ To get list of commands type ${prefix}help`);
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

  // if (command === `${prefix}update`) {
  //   let update = warframeVersion;
  //   let embed = new Discord.RichEmbed()
  //     .setAuthor(update.title)
  //     .setDescription(update.link)
  //     .setImage(update.image)
  //     .setColor(color)
  //     .addField(
  //       "Date released: ",
  //       moment(message.author.createdAt, "YYYY-MM-DDTHH:mm:ss.000Z").format(
  //         //Dont show date when author created account
  //         "dddd, MMMM Do YYYY. HH:mm:ss"
  //       )
  //     )
  //     .setThumbnail(
  //       "https://www.bleedingcool.com/wp-content/uploads/2017/12/warframe-Logo.jpg"
  //     );
  //   if (update.version !== "") embed.addField("Version", update.version);
  //   message.channel.send(embed);
  // }

  if (command == `${prefix}alerts`) {
    console.log("waiting!");
    await updateWorldState();
    console.log("Done!");
    let pos = 0;
    let embed = await generateEmbed.alertEmbed(pos, worldState); //Generate alert embed
    message.channel.send(embed).then(async sentMessage => {
      //Add nav reactions
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
        //Create reaction collector for 60s
        time: 60000
      });
      collector.on("collect", async reaction => {
        //Decide on stuff
        let name = reaction.emoji.name;
        console.log(name);
        if (name === "⏮") {
          pos = 0;
          sentMessage.edit(await generateEmbed.alertEmbed(pos, worldState));
        } else if (name === "◀") {
          if (pos > 0) {
            pos--;
            sentMessage.edit(await generateEmbed.alertEmbed(pos, worldState));
          }
        } else if (name === "▶") {
          if (pos < worldState.alerts.length - 1) pos++;
          sentMessage.edit(await generateEmbed.alertEmbed(pos, worldState));
        } else if (name === "⏭") {
          pos = worldState.alerts.length - 1;
          sentMessage.edit(await generateEmbed.alertEmbed(pos, worldState));
        }
        reaction.remove(message.author);
      });
      collector.on("end", collected => {}); //exit
    });
    return;
  }

  if (command === `${prefix}invasions`) {
    await updateWorldState();
    let embed = await generateEmbed.invasionEmbed(worldState);
    message.channel.send(embed);
  }

  if (command === `${prefix}sortie`) {
    await updateWorldState();
    let embed = await generateEmbed.sortieEmbed(worldState);
    message.channel.send(embed);
  }
});

async function updateWorldState() {
  await axios
    .get("http://content.warframe.com/dynamic/worldState.php")
    .then(res => {
      worldState = new WorldState(JSON.stringify(res.data));
    })
    .catch(error => {
      console.log(error);
    });
}

bot.login(process.env.token);
