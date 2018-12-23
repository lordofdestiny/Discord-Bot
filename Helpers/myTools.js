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

module.exports = {
  deleteMessage,
  snap,
  rgbIntToRgb,
  getJoke,
  updateWorldState
};
