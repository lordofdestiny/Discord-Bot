function deleteMessage(message) {
  message
    .delete(0)
    .then(() => {
      console.log("Message deleted!");
    })
    .catch(error => {
      console.log(error.stack);
    });
}

function snap(id) {
  let odds = Math.random();

  if (odds < 0.5)
    return "You were slain by Thanos, for the good of the Universe.";
  else return "You were spared by Thanos.";
}

module.exports = {
  deleteMessage,
  snap
};
