const myTools = require("../Helpers/myTools");

module.exports.run = (bot, message, args) => {
  myTools.deleteMessage(message);
  let doTts = args[args.length - 1] === "tts";
  myTools.getJoke().then(joke => {
    const myRegEx = new RegExp("&quot;", "g");
    joke = joke.replace(myRegEx, `'`);
    message.channel.send(`${joke}`, {
      tts: `${doTts}`
    });
  });
};

module.exports.help = {
  name: "joke",
  variants: [{ title: "Bot tells you a joke!", add: "*tts" }]
};
