const { random2D } = require("./utils");
const { identity } = require("./activationFns");
function createModel(...layers) {
  return {
    layers,
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
  let matchLen = inputs[0].length + 1; // account for bias
  let output = new Array(outRowLen);
  for (let i = 0; i < outRowLen; i++) {
    output[i] = new Array(outColLen);
    // extra input = bias of output node
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
  // extra weight as the value of bias
  let weights = random2D(inputLength + 1, outputLength);
  activationFn ??= identity;
  return {
    weights,
    activationFn,
  };
}
function train(
  optimizer,
  lossFn,
  model,
  iterations,
  trainInputs,
  trainOutputs,
) {
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

module.exports = {
  createLayer,
  createModel,
  train,
  processLayer,
  predict,
};
