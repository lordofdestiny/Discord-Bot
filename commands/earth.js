const myTools = require("../Helpers/myTools");

module.exports.run = (bot, message, args) => {
  myTools.updateWorldState().then(worldstate => {
    let { isDay, timeLeft } = worldstate.earthCycle;
    let toCome = isDay ? "Night" : "Day";
    let string = `Time to ${toCome}: ${timeLeft}`;
    message.channel.send(string);
  });
};

module.exports.help = {
  name: "earth",
  title: "Earth Day/Night cycle!",
  add: ""
};
