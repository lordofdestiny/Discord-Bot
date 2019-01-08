const Discord = require("discord.js");
const myTools = require("../Helpers/myTools");
const dragon = "botAvatar.png";
const { prefix } = process.env;
const color = "#F04747";
const commandsPerPage = 5;

let isEnableNavigation = args => {
  if (args.length == 0) return true;
  return isNaN(args[0]);
};

let countCommands = commands => {
  let count = 0;
  commands.forEach(command => {
    command.help.variants.forEach(() => {
      count++;
    });
  });
  return count;
};

let makeEmbed = (page, commands) => {
  let embed = new Discord.RichEmbed()
    .setTitle("Help!")
    .setColor(color)
    .setThumbnail(`attachment://${dragon}`)
    .setTimestamp();

  let { args } = this;
  let startIndex = page * commandsPerPage;
  let endIndex = (page + 1) * commandsPerPage;
  let maxPage = countCommands(commands) / commandsPerPage;

  if (args.length === 0) {
    for (let i = startIndex; i < endIndex; i++) {
      addVariants(embed, commands[i]);
    }
    embed.setFooter(
      `Page ${page + 1}/${maxPage}* Denotes optional parameter`,
      `attachment://${dragon}`
    );
  } else if (isNaN(args[0])) {
    let command = commands.get(args[0]);
    addVariants(embed, command);
    embed.setFooter("* Denotes optional parameter", `attachment://${dragon}`);
  }

  return {
    embed,
    files: [{ attachment: `images/${dragon}` }]
  };
};

let addVariants = (embed, command) => {
  let { name, variants } = command.help;
  variants.forEach(variant => {
    let { title, add } = variant;
    embed.addField(title, `${"```"}${prefix}${name} ${add}${"```"}`);
  });
};

module.exports.run = (bot, message, args) => {
  if (bot.commands.get(args[0]) == undefined && args.length != 0) {
    message.channel.send("I don't understand!");
    return;
  }
  let { commands } = bot;
  let enabled = isEnableNavigation(args);
  let pageIsGiven = !isNaN(args[0]);
  myTools.navigationController(
    bot,
    message,
    commands,
    makeEmbed.bind({ args: args }),
    60 * 1000,
    enabled,
    pageIsGiven ? parseInt(args[0]) : 0,
    countCommands(bot.commands) / commandsPerPage
  );

  message.channel.send(embed);
};

module.exports.help = {
  name: "help",
  variants: [
    {
      title: "Help about all commands!",
      add: ""
    },
    {
      title: "Shows specific page of all commnds list!",
      add: "<page>"
    },
    {
      title: "Shows help about one command!",
      add: "<command>"
    }
  ]
};
