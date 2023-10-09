function identity(x) {
  return x;
}
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
module.exports = {
  identity,
  sigmoid,
};
