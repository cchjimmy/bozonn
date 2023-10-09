const { map2D } = require("./utils");
function abs(m) {
  return map2D(m, (v) => Math.abs(v));
}
function sum(m) {
  let rowLen = m.length;
  let colLen = m[0].length;
  let sum = 0;
  for (let i = 0; i < rowLen; i++) {
    for (let j = 0; j < colLen; j++) {
      sum += m[i][j];
    }
  }
  return sum;
}
function multM(m1, m2) {
  let outRowLen = m1.length;
  let outColLen = m2[0].length;
  let matchLen = m1[0].length;
  let result = new Array(outRowLen);
  for (let i = 0; i < m1.length; i++) {
    result[i] = new Array(outColLen);
    for (let j = 0; j < outColLen; j++) {
      let value = 0;
      for (let k = 0; k < matchLen; k++) {
        value += m1[i][k] * m2[k][j];
      }
      result[i][j] = value;
    }
  }
  return result;
}
function addM(m1, m2) {
  return map2D(m1, (v, i, j) => v + m2[i][j]);
}
function subM(m1, m2) {
  return map2D(m1, (v, i, j) => v - m2[i][j]);
}
function subS(m, s) {
  return map2D(m, (v) => v - s);
}
function multS(m, s) {
  return map2D(m, (v) => v * s);
}
function power(m, exp) {
  return map2D(m, (v) => v ** exp);
}
function mean(m) {
  return sum(m) / (m.length * m[0].length);
}
module.exports = {
  abs,
  sum,
  multM,
  addM,
  subM,
  subS,
  multS,
  power,
  mean,
};
