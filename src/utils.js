function random(min, max) {
  return Math.random() * (max - min) + min;
}
function random2D(m, n, min, max) {
  min ??= -1;
  max ??= 1;
  let result = new Array(m);
  for (let i = 0; i < m; i++) {
    result[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      result[i][j] = random(min, max);
    }
  }
  return result;
}
function derivative1D(fn, x, halfStepSize) {
  // midpoint method
  halfStepSize ??= 1e-5;
  return (fn(x + halfStepSize) - fn(x - halfStepSize)) / (2 * halfStepSize);
}
function fill2D(m, n, value) {
  value ??= 0;
  let result = new Array(m);
  let row = new Array(n).fill(value);
  for (let i = 0; i < m; i++) {
    result[i] = row.slice();
  }
  return result;
}
function copy2D(m) {
  let result = [];
  for (let i = 0; i < m.length; i++) {
    result[i] = m.splice();
  }
  return result;
}
function findMinMax2D(m) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0, x = m.length; i < x; i++) {
    for (let j = 0, y = m[i].length; j < y; j++) {
      let v = m[i][j];
      min = v < min ? v : min;
      max = v > max ? v : max;
    }
  }
  return [min, max];
}
function percent(min, max, current) {
  return (current - min) / (max - min);
}
function map2D(m, callback) {
  let rowLen = m.length;
  let result = new Array(rowLen);
  for (let i = 0; i < rowLen; i++) {
    result[i] = m[i].map((v, j) => callback(v, i, j));
  }
  return result;
}
module.exports = {
  random,
  random2D,
  derivative1D,
  fill2D,
  copy2D,
  findMinMax2D,
  percent,
  map2D,
};
