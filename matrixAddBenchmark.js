const { addM } = require("./src/mat");
const { fill2D } = require("./src/utils");
!function main() {
  function vanillaAddM(m1, m2) {
    let rowLen = m1.length;
    let colLen = m1[0].length;
    let result = new Array(rowLen);
    for (let i = 0; i < rowLen; i++) {
      result[i] = new Array(colLen);
      for (let j = 0; j < colLen; j++) {
        result[i][j] = m1[i][j] + m2[i][j];
      }
    }
    return result;
  }
  function addMReduceNative(m1, m2) {
    let rowLen = m1.length;
    let colLen = m1[0].length;
    let result = new Array(rowLen);
    for (let i = 0; i < rowLen; i++) {
      m1[i].reduce((acc, cur, j) => {
        acc[j] = cur + m2[i][j];
        return acc;
      }, result[i] = new Array(colLen));
    }
    return result;
  }
  let inputs = fill2D(100, 100, 10);
  let outputs = fill2D(100, 100, 2);
  let candidates = [
    () => addM(inputs, outputs),
    () => vanillaAddM(inputs, outputs),
    () => addMReduceNative(inputs, outputs),
  ];
  let iterations = 100000;
  let times = [];
  for (let i = 0; i < candidates.length; i++) {
    times[i] = new Array(iterations);
    for (let j = 0; j < iterations; j++) {
      let time = performance.now();
      candidates[i]();
      times[i][j] = performance.now() - time;
    }
  }

  let mean = [];
  for (let i = 0; i < times.length; i++) {
    mean[i] = 0;
    for (let j = 0; j < times[i].length; j++) {
      mean[i] += times[i][j];
    }
    mean[i] /= times[i].length;
  }
  console.log(mean);
}();
