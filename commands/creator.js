module.exports.run = (bot, message, args) => {
  message.reply(
    'I was created by Branislav Đumić, a student of ETŠ "Rade Končar", Beograd'
  );
};

module.exports.help = {
  name: "creator",
  title: "I will tell you my creator!",
  add: ""
};
