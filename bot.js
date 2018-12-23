require("dotenv").config();
const Discord = require("discord.js");
const moment = require("moment");
const fs = require("fs");
//const myTools = require("./Helpers/myTools");
// const WarframeVersion = require("warframe-updates");
// const warframeVersion = new WarframeVersion();
const generateEmbed = require("./Helpers/generate");
const { prefix, token, serviceAccount } = process.env;

const bot = new Discord.Client({ disableEveryone: true });
bot.commands = new Discord.Collection();

fs.readdir("./commands", (err, files) => {
  if (err) console.log(error);

  let jsFiles = files.filter(f => f.split(".").pop() === "js");

  if (jsFiles.length <= 0) console.log("No commands found!");

  console.log(`Loading ${jsFiles.length} files...`);

  jsFiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`Loading ${i + 1}. command... `);
    bot.commands.set(props.help.name, props);
  });
  console.log("All commands loaded!");
});

//sql.open("./database.sqlite");

bot.on("ready", async () => {
  bot
    .generateInvite(["ADMINISTRATOR"])
    .then(link => {
      console.log(link);
    })
    .catch(error => {
      console.log(error.stack);
    });
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);
  // var flag = false;

  /* await sql //Load hate
    .get(`SELECT * FROM hates WHERE userId = "${message.author.id}"`)
    .then(row => {
      if (row.hated) {
        flag = true;
      }
    })
    .catch(erorr => {
      sql
        .run(
          "CREATE TABLE IF NOT EXISTS hates (userId TEXT, warned BOOLEAN, hated BOOLEAN)"
        )
        .then(() => {
          console.log("Created table");
        })
        .catch(error => {
          console.log("Error while creating hates table");
        });
    });

  if (message.isMentioned(bot.user)) {
    sql
      .get(`SELECT * FROM hates WHERE userId = "${message.author.id}"`)
      .then(row => {
        if (!row) {
          sql
            .run("INSERT INTO hates (userId, warned, hated) VALUES (?, ?, ?)", [
              message.author.id,
              true,
              false
            ])
            .then(() => {
              message.reply("Don't do that ever again!!!  (╯°□°）╯︵ ┻━┻");
            })
            .catch(() => {
              console.log("Error while first warning!");
            });
        } else if (row.hated) {
          message.reply("¯\\_(ツ)_/¯");
        } else if (row.warned) {
          sql
            .run(
              `UPDATE hates SET warned = ${true}, hated = ${true} WHERE userId = ${
                message.author.id
              } `
            )
            .then(() => {
              message.reply(
                "(╯°□°）╯︵ ┻━━━━━┻ I've warned you already!!!\n I'll ignore you in the future!"
              );
            })
            .catch(() => {
              console.log("Error while hating!");
            });
        } else if (!row.warned) {
          sql
            .run(
              `UPDATE hates SET warned = ${true}, hated = ${false} WHERE userId = ${
                message.author.id
              } `
            )
            .then(() => {
              message.reply("Don't do that ever again!!!  (╯°□°）╯︵ ┻━┻");
            })
            .catch(() => {
              console.log("Error while adding warning!");
            });
        }
      });
    return;
  }

  sql //Load scores
    .get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`)
    .then(row => {
      if (!row) {
        sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [
          message.author.id,
          1,
          0
        ]);
      } else {
        let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
        if (curLevel > row.level) {
          row.level = curLevel;
          sql.run(
            `UPDATE scores SET points = ${row.points + 1}, level = ${
              row.level
            } WHERE userId = "${message.author.id}"`
          );
          message.reply(
            `You've leveled up to level **${curLevel}**! Ain't that dandy?`
          );
        }
        sql.run(
          `UPDATE scores SET points = ${row.points + 1} WHERE userId = "${
            message.author.id
          }"`
        );
      }
    })
    .catch(() => {
      sql
        .run(
          "CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)"
        )
        .then(() => {
          sql.run(
            "INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)",
            [message.author.id, 1, 0]
          );
        });
    }); */

  if (!command.startsWith(prefix)) {
    return;
  }

  let cmd = bot.commands.get(command.slice(prefix.length));
  if (cmd) cmd.run(bot, message, args);
  else message.reply(`To get list of commands type ${prefix}help`);

  if (command === `${prefix}sorry`) {
    /* sql
      .get(`SELECT * FROM hates WHERE userId = "${message.author.id}" `)
      .then(row => {
        if (!row || (!row.hated && !row.warned)) {
          message.reply("You have nothing to be sorry for. 😉");
        } else if (row.hated) {
          sql
            .run(
              `UPDATE hates SET warned = ${false}, hated = ${false} WHERE userId = "${
                message.author.id
              }"`
            )
            .then(() => {
              console.log("Successful!");
              message.reply("You saved yourself. ┬─┬ ノ( ゜-゜ノ)");
            })
            .catch(error => {
              console.log(error);
            });
        } else if (row.warned) {
          message.reply("It's just a warning, no sorry yet!");
        }
      });
    return; */
  }

  /* if (flag) {
    message.reply("¯\\_(ツ)_/¯");
    return;
  } */

  // if (command === `${prefix}update`) {
  //   let update = warframeVersion;
  //   let embed = new Discord.RichEmbed()
  //     .setAuthor(update.title)
  //     .setDescription(update.link)
  //     .setImage(update.image)
  //     .setColor(color)
  //     .addField(
  //       "Date released: ",
  //       moment(message.author.createdAt, "YYYY-MM-DDTHH:mm:ss.000Z").format(
  //         //Dont show date when author created account
  //         "dddd, MMMM Do YYYY. HH:mm:ss"
  //       )
  //     )
  //     .setThumbnail(
  //       "https://www.bleedingcool.com/wp-content/uploads/2017/12/warframe-Logo.jpg"
  //     );
  //   if (update.version !== "") embed.addField("Version", update.version);
  //   message.channel.send(embed);
  // }

  if (command === `${prefix}profile`) {
    /* sql
      .get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`)
      .then(async row => {
        if (!row) return message.reply("Your current level is 0");
        let embed = await generateEmbed.userEmbed(row, message.author);

        message.channel.send(embed);
      }); */
  }

  if (command === `${prefix}invasions`) {
    await updateWorldState();
    let embed = await generateEmbed.invasionEmbed(worldState);
    message.channel.send(embed);
    return;
  }

  if (command === `${prefix}sortie`) {
    await updateWorldState();
    let embed = await generateEmbed.sortieEmbed(worldState);
    message.channel.send(embed);
    return;
  }

  if (command === `${prefix}fissures`) {
    await updateWorldState();
    let embed = await generateEmbed.fissuresEmbed(worldState);
    message.channel.send(embed);
    return;
  }

  if (command === `${prefix}baro`) {
    await updateWorldState();
    let embed = await generateEmbed.BaroEmbed(worldState);
    message.channel.send(embed);
    return;
  }
});

bot.login(token);
