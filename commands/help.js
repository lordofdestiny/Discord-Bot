const Discord = require("discord.js");
const myTools = require("../Helpers/myTools");
const dragon = "botAvatar.png";
const { prefix, BOT_COLOR: color } = process.env;
const commandsPerPage = 5;

function isEnableNavigation(args) {
  if (args.length == 0) return true;
  return !isNaN(args[0]);
}

function addVariants(embed, command) {
  let { name, variants } = command.help;
  variants.forEach(variant => {
    let { title, add } = variant;
    embed.addField(title, `${"```"}${prefix}${name} ${add}${"```"}`);
  });
}

function makeEmbed(page, commands, duration, expired, args) {
  let embed = new Discord.RichEmbed()
    .setTitle("Help!")
    .setColor(color)
    .setThumbnail(`attachment://${dragon}`)
    .setTimestamp();

  args = args.args;

  let commandNames = Array.from(commands.keys());

  let footerText = `* Denotes optional parameter • ${
    expired ? "Expired" : `Expires in ${Math.round(duration / 1000)}s`
  }`;

  if (args.length === 0) {
    let commandCount = commands.size;
    let startIndex = page * commandsPerPage;
    let maxPage = Math.ceil(commandCount / commandsPerPage);
    let endIndex = startIndex + commandsPerPage;

    for (let i = startIndex; i < endIndex && i < commandCount; i++) {
      let command = commands.get(commandNames[i]);
      addVariants(embed, command);
    }

    footerText = `Page ${page + 1}/${maxPage}•` + footerText;
  } else if (isNaN(args[0])) {
    let command = commands.get(args[0]);
    addVariants(embed, command);
    embed.setFooter(footerText, `attachment://${dragon}`);
  }

  embed.setFooter(footerText);

  return {
    embed,
    files: [
      {
        attachment: `images/${dragon}`
      }
    ]
  };
}

module.exports.run = (bot, message, args) => {
  if (
    !(
      args.length === 0 ||
      (args.length === 1 || bot.commands.get(args[0]) != undefined)
    )
  ) {
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
    makeEmbed,
    {
      args: args
    },
    60 * 1000,
    enabled,
    pageIsGiven ? parseInt(args[0]) : 0,
    Math.ceil(commands.size / commandsPerPage)
  );
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
