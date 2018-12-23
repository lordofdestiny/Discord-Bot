const myTools = require("../Helpers/myTools");

module.exports.run = (bot, message, args) => {
  let doTts = args[args.length - 1] === "tts";
  message.reply(`${myTools.snap()}`, {
    tts: `${doTts}`
  });
};

module.exports.help = {
  name: "snap",
  title: "Ask Thanos if he snapped you from existance!",
  add: "*tts"
};
