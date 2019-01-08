const axios = require("axios");
const WorldState = require("warframe-worldstate-parser");

let deleteMessage = message => {
  message
    .delete(0)
    .then(() => {})
    .catch(error => {
      console.log(error.stack);
    });
};

let snap = id => {
  let odds = Math.random();

  return odds < 0.5
    ? "You were slain by Thanos, for the good of the Universe."
    : "You were spared by Thanos.";
};

let rgbIntToRgb = rbgInt => {
  let blue = rbgInt & 255;
  let green = (rbgInt >> 8) & 255;
  let red = (rbgInt >> 16) & 255;

  return [red, green, blue];
};

let getJoke = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://api.icndb.com/jokes/random")
      .then(res => {
        let joke = res.data.value.joke;
        joke.replace(/(?:&quot;)/, `"`);
        resolve(joke);
      })
      .catch(error => {
        reject(error.stack);
      });
  });
};

let updateWorldState = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://content.warframe.com/dynamic/worldState.php")
      .then(res => {
        let data = res.data;
        worldstate = new WorldState(JSON.stringify(data));
        resolve(worldstate);
      })
      .catch(error => {
        reject(error.stack);
      });
  });
};

let navigationController = (
  bot,
  message,
  embedData,
  makeEmbed,
  optionalMakeEmbedArguments = {},
  duration = 30000,
  enable = true,
  startPage = 0,
  pages = embedData.length
) => {
  let pos = startPage;
  botID = bot.user.id;
  let embed = makeEmbed(pos, embedData, optionalMakeEmbedArguments);

  message.channel.send(embed).then(response => {
    if (!enable) return;
    //Add nav reactions
    response.react("⏮").then(() => {
      response.react("◀").then(() => {
        response.react("▶").then(() => {
          response.react("⏭").then(() => {
            const filter = (reaction, user) => {
              let { name } = reaction.emoji;
              return (
                (name === "⏮" ||
                  name === "◀" ||
                  name === "▶" ||
                  name === "⏭") &&
                user.id != botID
              );
            };
            const collector = response.createReactionCollector(filter, {
              time: duration
            });
            collector.on("collect", reaction => {
              let { name } = reaction.emoji;
              if (name === "⏮") pos = 0;
              else if (name === "◀") pos -= pos > 0 ? 1 : 0;
              else if (name === "▶") pos += pos < pages - 1 ? 1 : 0;
              else if (name === "⏭") pos = pages - 1;
              let embed = makeEmbed(pos, embedData, optionalMakeEmbedArguments);
              response.edit(embed).then(() => {
                reaction.remove(message.author);
              });
            });
            collector.on("end", collected => {
              console.log("Collecting done!");
              response.reactions.array().forEach(reaction => {
                reaction.remove(bot.user);
              });
            });
          });
        });
      });
    });
  });
};

module.exports = {
  deleteMessage,
  snap,
  rgbIntToRgb,
  getJoke,
  updateWorldState,
  navigationController
};
