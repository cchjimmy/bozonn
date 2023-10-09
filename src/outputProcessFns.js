const { findMinMax2D, map2D, percent } = require("./utils");
function softmax(inputs) {
  let [min, max] = findMinMax2D(inputs);
  return map2D(inputs, (v) => percent(min, max, v));
}
module.exports = {
  softmax,
};
