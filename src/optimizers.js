const { addM, multS, subM } = require("./mat");
const { random2D, derivative1D } = require("./utils");
const { predict, processLayer } = require("./nN");
// TODO: finish gradient descent
function gradientDescent(learningRate) {
  return (lossFn, model, trainInputs, trainOutputs) => {
    // forward pass
    let numLayers = model.layers.length;
    let activations = new Array(numLayers + 1);
    activations[0] = trainInputs;
    for (let i = 0; i < numLayers; i++) {
      // capture output of each layer
      activations[i + 1] = processLayer(model.layers[i], activations[i]);
    }
    // for a target and prediction
    // error = target - prediction
    // d(error)/d(weight) = d(error)/d(prediction) * d(prediction)/d(weight)
    // d(error)/d(prediction) = -1
    // prediction = activationFn(weighted sum), where weighted sum = inputs . weights + bias weight
    // d(prediction)/d(weight) = d(activationFn)/d(weighted sum) * d(weighted sum)/d(weight)
    // d(activationFn)/d(weighted sum) = derivative1D(activationFn, weighted sum)
    // d(weighted sum)/d(weight) =  input
    // d(error)/d(weight) = -1 * derivative1D(activationFn, weighted sum) * input
    // d(error)/d(input) = -1 * derivative1D(activationFn, weighted sum)
    // d(error)/d(input) is analogeous to error, as input is an activation from previous layer. this value is propagated back through the network
    let error = subM(trainOutputs, activations[numLayers]);
    let numOutputs = error.length;
    for (let i = 0; i < numOutputs; i++) {
      let dErrorDInputs = error[i];
      for (let j = numLayers - 1; j >= 0; j--) {
        let activationFn = model.layers[j].activationFn;
        let weights = model.layers[j].weights;
        let layerInputLen = weights.length;
        let layerOutputLen = weights[0].length;
        for (let k = 0; k < dErrorDInputs.length; k++) {
          dErrorDInputs[k] *= derivative1D(
            activationFn,
            activations[j + 1][i][k],
          );
          for (let l = 0; l < layerOutputLen; l++) {
            for (let m = 0; m < layerInputLen; m++) {
              let input = activations[j][i][m] ?? 1;
              weights[m][l] += learningRate * -dErrorDInputs[k] * input;
              weights[m][l] /= numOutputs;
            }
          }
        }
      }
    }
    return lossFn(trainOutputs, predict(model, trainInputs));
  };
}
function evolution(mutation) {
  return (lossFn, model, trainInputs, trainOutputs) => {
    let loss = lossFn(trainOutputs, predict(model, trainInputs));
    if (loss < mutation) return loss;
    let oldWs = model.layers.map((layer) => layer.weights);
    let childLoss = Number.POSITIVE_INFINITY;
    while (childLoss > loss) {
      for (let i = 0; i < oldWs.length; i++) {
        model.layers[i].weights = addM(
          oldWs[i],
          multS(random2D(oldWs[i].length, oldWs[i][0].length), mutation),
        );
      }
      childLoss = lossFn(trainOutputs, predict(model, trainInputs));
    }
    return childLoss;
  };
}
module.exports = {
  // gradientDescent,
  evolution,
};
