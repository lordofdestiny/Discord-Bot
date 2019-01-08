const myTools = require("../Helpers/myTools");
const { prefix } = process.env;

module.exports.run = (bot, message, args) => {
  myTools.deleteMessage(message);
  let rest = message.content
    .slice((this.help.name + prefix).length)
    .replace(" tts", "");
  let doTts = args[args.length - 1] === "tts";
  message.channel.send(`${rest}`, { tts: `${doTts}` });
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
