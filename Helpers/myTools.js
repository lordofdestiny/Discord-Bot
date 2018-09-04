function deleteMessage(message) {
  message
    .delete(0)
    .then(() => {})
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

function rbgIntToRgb(rbgInt) {
  let blue = rbgInt & 255;
  let green = (rbgInt >> 8) & 255;
  let red = (rbgInt >> 16) & 255;

  return [red, green, blue];
}

module.exports = {
  deleteMessage,
  snap,
  rbgIntToRgb
};
