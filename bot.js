require("dotenv").config();
const Discord = require("discord.js");
// const moment = require("moment");
const fs = require("fs");
//const myTools = require("./Helpers/myTools");
// const WarframeVersion = require("warframe-updates");
// const warframeVersion = new WarframeVersion();
const { prefix, token } = process.env;
const myTools = require("./Helpers/myTools");

const bot = new Discord.Client({
  disableEveryone: true
});
bot.commands = new Discord.Collection();

fs.readdir("./commands", (err, files) => {
  if (err) console.log(error);

  let jsFiles = files.filter(f => f.split(".").pop() === "js");

  if (jsFiles.length <= 0) console.log("No commands found!");

  console.log(`Loading ${jsFiles.length} files...`);

  jsFiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    //console.log(`Loading ${i + 1}. command... `);
    let { help } = props;
    if (!help.ignore || help.ignore == undefined)
      bot.commands.set(props.help.name, props);
  });
  console.log("All commands loaded!");
});

//sql.open("./database.sqlite");

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

bot.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if (!command.startsWith(prefix)) {
    return;
  }

  if (command === `${prefix}key`) {
    myTools.updateWorldState().then(worldstate => {
      console.log(command);
      console.log(args);
      if (args.length === 0) console.log(Object.keys(worldstate));
      else {
        let keys = Object.keys(worldstate[args[0]]);
        keys.forEach((key, i) => {
          console.log(`${i}. ${key} => Type: ${typeof worldstate[args[0]]}`);
        });
        console.log(worldstate[args[0]][0].jobs);
      }
    });
    return;
  }

  let cmd = bot.commands.get(command.slice(prefix.length));
  if (cmd) {
    cmd.run(bot, message, args);
    //console.log(`Served !${cmd.help.name} to ${message.author.username}`);
    message.react("✅");
  } else message.reply(`To get list of commands type ${prefix}help`);
});

bot.on("debug", console.log);

bot.login(token);
