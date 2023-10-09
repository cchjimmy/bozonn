const { abs, subM, power, mean } = require("./mat");
function meanAbsoluteError(targets, predictions) {
  return mean(abs(subM(targets, predictions)));
}
function meanSquareError(targets, predictions) {
  return mean(power(subM(targets, predictions), 2));
}
module.exports = {
  meanAbsoluteError,
  meanSquareError,
};
