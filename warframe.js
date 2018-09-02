const request = require("request-promise");
const WorldState = require("warframe-worldstate-parser");

class Warframe {
  constructor(options = { interval: 60000 }) {
    let data;
    this.refresh();
    setInterval(() => {
      this.refresh();
    }, options.interval);
  }

  refresh() {
    request
      .get("http://content.warframe.com/dynamic/worldState.php")
      .then(res => {
        this.data = new WorldState(res);
        let keyNames = Object.keys(this.data);
        console.log(this.data.news);
      })
      .catch(err => {
        console.log("Data wasn't retrieved!");
        console.log(err);
      });
  }
}

module.exports = Warframe;
