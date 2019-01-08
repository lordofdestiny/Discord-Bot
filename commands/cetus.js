const myTools = require("../Helpers/myTools");

module.exports.run = (bot, message, args) => {
  myTools.updateWorldState().then(worldstate => {
    let { isDay, timeLeft } = worldstate.cetusCycle;
    let toCome = isDay ? "Night" : "Day";
    let string = `Time to ${toCome}: ${timeLeft}`;
    message.channel.send(string);
  });
};

module.exports.help = {
  name: "cetus",
  variants: [{ title: "Cetus Day/Night cycle!", add: "" }]
};
