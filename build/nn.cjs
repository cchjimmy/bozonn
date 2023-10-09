var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports2, module2) {
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
    module2.exports = {
      random,
      random2D,
      derivative1D,
      fill2D,
      copy2D,
      findMinMax2D,
      percent,
      map2D
    };
  }
});

// src/activationFns.js
var require_activationFns = __commonJS({
  "src/activationFns.js"(exports2, module2) {
    function identity(x) {
      return x;
    }
    function sigmoid(x) {
      return 1 / (1 + Math.exp(-x));
    }
    module2.exports = {
      identity,
      sigmoid
    };
  }
});

// src/nN.js
var require_nN = __commonJS({
  "src/nN.js"(exports2, module2) {
    var { random2D } = require_utils();
    var { identity } = require_activationFns();
    function createModel(...layers) {
      return {
        layers
      };
    }
    function predict(model, inputs) {
      for (let i = 0; i < model.layers.length; i++) {
        inputs = processLayer(model.layers[i], inputs);
      }
      return inputs;
    }
    function processLayer(layer, inputs) {
      let outRowLen = inputs.length;
      let outColLen = layer.weights[0].length;
      let matchLen = inputs[0].length + 1;
      let output = new Array(outRowLen);
      for (let i = 0; i < outRowLen; i++) {
        output[i] = new Array(outColLen);
        inputs[i].push(1);
        for (let j = 0; j < outColLen; j++) {
          output[i][j] = 0;
          for (let k = 0; k < matchLen; k++) {
            output[i][j] += inputs[i][k] * layer.weights[k][j];
          }
          output[i][j] = layer.activationFn(output[i][j]);
        }
        inputs[i].pop();
      }
      return output;
    }
    function createLayer(inputLength, outputLength, activationFn) {
      let weights = random2D(inputLength + 1, outputLength);
      activationFn ??= identity;
      return {
        weights,
        activationFn
      };
    }
    function train(optimizer, lossFn, model, iterations, trainInputs, trainOutputs) {
      console.log("training starts");
      let finalLoss;
      for (let i = 0; i < iterations; i++) {
        finalLoss = optimizer(lossFn, model, trainInputs, trainOutputs);
        if (i % (iterations / 5) == 0) {
          console.log(`progress: ${i / iterations * 100}%`);
        }
      }
      console.log("progress: 100%\ntraining ends");
      return finalLoss;
    }
    module2.exports = {
      createLayer,
      createModel,
      train,
      processLayer,
      predict
    };
  }
});

// src/outputProcessFns.js
var require_outputProcessFns = __commonJS({
  "src/outputProcessFns.js"(exports2, module2) {
    var { findMinMax2D, map2D, percent } = require_utils();
    function softmax(inputs) {
      let [min, max] = findMinMax2D(inputs);
      return map2D(inputs, (v) => percent(min, max, v));
    }
    module2.exports = {
      softmax
    };
  }
});

// src/mat.js
var require_mat = __commonJS({
  "src/mat.js"(exports2, module2) {
    var { map2D } = require_utils();
    function abs(m) {
      return map2D(m, (v) => Math.abs(v));
    }
    function sum(m) {
      let rowLen = m.length;
      let colLen = m[0].length;
      let sum2 = 0;
      for (let i = 0; i < rowLen; i++) {
        for (let j = 0; j < colLen; j++) {
          sum2 += m[i][j];
        }
      }
      return sum2;
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
    module2.exports = {
      abs,
      sum,
      multM,
      addM,
      subM,
      subS,
      multS,
      power,
      mean
    };
  }
});

// src/optimizers.js
var require_optimizers = __commonJS({
  "src/optimizers.js"(exports2, module2) {
    var { addM, multS, subM } = require_mat();
    var { random2D, derivative1D } = require_utils();
    var { predict, processLayer } = require_nN();
    function evolution(mutation) {
      return (lossFn, model, trainInputs, trainOutputs) => {
        let loss = lossFn(trainOutputs, predict(model, trainInputs));
        if (loss < mutation)
          return loss;
        let oldWs = model.layers.map((layer) => layer.weights);
        let childLoss = Number.POSITIVE_INFINITY;
        while (childLoss > loss) {
          for (let i = 0; i < oldWs.length; i++) {
            model.layers[i].weights = addM(
              oldWs[i],
              multS(random2D(oldWs[i].length, oldWs[i][0].length), mutation)
            );
          }
          childLoss = lossFn(trainOutputs, predict(model, trainInputs));
        }
        return childLoss;
      };
    }
    module2.exports = {
      // gradientDescent,
      evolution
    };
  }
});

// src/lossFns.js
var require_lossFns = __commonJS({
  "src/lossFns.js"(exports2, module2) {
    var { abs, subM, power, mean } = require_mat();
    function meanAbsoluteError(targets, predictions) {
      return mean(abs(subM(targets, predictions)));
    }
    function meanSquareError(targets, predictions) {
      return mean(power(subM(targets, predictions), 2));
    }
    module2.exports = {
      meanAbsoluteError,
      meanSquareError
    };
  }
});

// src/exports.js
module.exports = {
  nN: require_nN(),
  activationFns: require_activationFns(),
  outputProcessFns: require_outputProcessFns(),
  optimizers: require_optimizers(),
  lossFns: require_lossFns()
};
