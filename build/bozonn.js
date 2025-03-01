// src/utils.js
function random(min, max) {
  min ??= 0;
  max ??= 1;
  return Math.random() * (max - min) + min;
}
function randomM(m, n, min, max) {
  const result = new Array(m);
  for (let i = 0; i < m; i++) {
    result[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      result[i][j] = random(min, max);
    }
  }
  return result;
}
function derivative1D(fn, x, halfStepSize) {
  halfStepSize ??= 1e-8;
  return (fn(x + halfStepSize) - fn(x - halfStepSize)) / (2 * halfStepSize);
}
function findMinMaxM(m) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0, x = m.length; i < x; i++) {
    for (let j = 0, y = m[i].length; j < y; j++) {
      const v = m[i][j];
      min = v < min ? v : min;
      max = v > max ? v : max;
    }
  }
  return [min, max];
}
function percent(min, max, current) {
  return (current - min) / (max - min);
}
function mapM(m, callback) {
  return m.map(
    (element, index) => element.map((element1, index1) => callback(element1, index, index1))
  );
}
function reduceM(m, callback, accumulator) {
  return m.reduce(
    (accum, current, index) => current.reduce(
      (accum1, current1, index1) => callback(
        accum1,
        current1,
        index,
        index1
      ),
      accum
    ),
    accumulator
  );
}

// src/activationFns.js
function identity(x) {
  return x;
}
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}
function relu(x) {
  return Math.max(0, x);
}

// src/nN.js
function createModel(...layers) {
  return {
    layers
  };
}
function predict(model, inputs) {
  for (let i = 0, m = model.layers.length; i < m; i++) {
    inputs = processLayer(model.layers[i], inputs);
  }
  return inputs;
}
var fns = [identity, sigmoid];
function processLayer(layer, inputs) {
  const outRowLen = inputs.length;
  const outColLen = layer.weights[0].length;
  const matchLen = inputs[0].length + 1;
  const output = new Array(outRowLen);
  for (let i = 0; i < outRowLen; i++) {
    output[i] = new Array(outColLen);
    inputs[i].push(1);
    for (let j = 0; j < outColLen; j++) {
      output[i][j] = 0;
      for (let k = 0; k < matchLen; k++) {
        output[i][j] += inputs[i][k] * layer.weights[k][j];
      }
      output[i][j] = fns[layer.activationFn](output[i][j]);
    }
    inputs[i].pop();
  }
  return output;
}
function createLayer(inputLength, outputLength, activationFn) {
  const weights = randomM(inputLength + 1, outputLength, -1, 1);
  activationFn ??= identity;
  return {
    weights,
    activationFn: fns.indexOf(activationFn)
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
function getWeights(model) {
  return model.layers.map((x) => x.weights);
}

// src/mat.js
function abs(m) {
  return mapM(m, (v) => Math.abs(v));
}
function sum(m) {
  return reduceM(m, (accum, curr) => accum + curr, 0);
}
function subM(m1, m2) {
  return mapM(m1, (v, i, j) => v - m2[i][j]);
}
function power(m, exp) {
  return mapM(m, (v) => v ** exp);
}
function mean(m) {
  return sum(m) / (m.length * m[0].length);
}

// src/lossFns.js
function meanAbsoluteError(targets, predictions) {
  return mean(abs(subM(targets, predictions)));
}
function meanSquareError(targets, predictions) {
  return mean(power(subM(targets, predictions), 2));
}

// src/optimizers.js
function getGradients(lossFn, model, trainInputs, trainOutputs) {
  const layerLen = model.layers.length;
  const activations = new Array(layerLen);
  activations[0] = processLayer(model.layers[0], trainInputs);
  for (let i = 1; i < layerLen; i++) {
    activations[i] = processLayer(
      model.layers[i],
      activations[i - 1]
    );
  }
  const gradients = new Array(layerLen);
  for (let i = layerLen - 1; i >= 0; i--) {
    const input = i == 0 ? trainInputs : activations[i - 1];
    gradients[i] = mapM(
      model.layers[i].weights,
      (x, row, col) => derivative1D(
        (x2) => {
          const old = model.layers[i].weights[row][col];
          model.layers[i].weights[row][col] = x2;
          let prediction = input;
          for (let j = i; j < layerLen; j++) {
            prediction = processLayer(
              model.layers[j],
              prediction
            );
          }
          model.layers[i].weights[row][col] = old;
          return lossFn(
            trainOutputs,
            prediction
          );
        },
        x
      )
    );
  }
  return gradients;
}
function gradientDescent(stepSize, maxTries) {
  maxTries ??= 100;
  return (lossFn, model, trainInputs, trainOutputs) => {
    const gradients = getGradients(
      lossFn,
      model,
      trainInputs,
      trainOutputs
    );
    const beginLoss = lossFn(trainOutputs, predict(model, trainInputs));
    const layerLen = model.layers.length;
    const oldWs = model.layers.map((l) => l.weights);
    let newStepSize = stepSize;
    for (let j = 0; j < maxTries; j++) {
      let prediction = trainInputs;
      for (let i = 0; i < layerLen; i++) {
        model.layers[i].weights = mapM(
          oldWs[i],
          (x, row, col) => {
            return x - gradients[i][row][col] * newStepSize;
          }
        );
        prediction = processLayer(model.layers[i], prediction);
      }
      const endLoss = lossFn(trainOutputs, prediction);
      if (endLoss < beginLoss) return endLoss;
      newStepSize *= 0.1;
    }
    model.layers.map((l, i) => l.weights = oldWs[i]);
    return beginLoss;
  };
}
function evolution(stepSize, maxTries) {
  maxTries ??= 100;
  return (lossFn, model, trainInputs, trainOutputs) => {
    const beginLoss = lossFn(
      trainOutputs,
      predict(model, trainInputs)
    );
    const layerLen = model.layers.length;
    const oldWs = model.layers.map((l) => l.weights);
    for (let t = 0; t < maxTries; t++) {
      let prediction = trainInputs;
      for (let i = 0; i < layerLen; i++) {
        model.layers[i].weights = mapM(
          oldWs[i],
          (x) => x + random(
            -stepSize,
            stepSize
          )
        );
        prediction = processLayer(
          model.layers[i],
          prediction
        );
      }
      const endLoss = lossFn(trainOutputs, prediction);
      if (endLoss < beginLoss) return endLoss;
    }
    model.layers.map((l, i) => l.weights = oldWs[i]);
    return beginLoss;
  };
}

// src/outputProcessFns.js
function softmax(inputs) {
  const [min, max] = findMinMaxM(inputs);
  return mapM(inputs, (v) => percent(min, max, v));
}
export {
  createLayer,
  createModel,
  evolution,
  getGradients,
  getWeights,
  gradientDescent,
  identity,
  meanAbsoluteError,
  meanSquareError,
  predict,
  processLayer,
  relu,
  sigmoid,
  softmax,
  train
};
