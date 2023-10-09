var out = require("./build/nn.cjs");
const { createModel, createLayer, predict, train } = out.nN;
const { evolution } = out.optimizers;
const { meanSquareError } = out.lossFns;
!function main() {
  var inputs = [
    [0],
    [5],
    [13],
    [-9],
    [312],
  ];
  var outputs = [
    [2],
    [7],
    [15],
    [-7],
    [314],
  ];
  var model = createModel(createLayer(1, 1));
  var trainError = train(
    evolution(0.1),
    meanSquareError,
    model,
    100000,
    inputs,
    outputs,
  );
  console.log("error after training\n", trainError);
  let weights = model.layers.map((v) => v.weights);
  console.log("weights\n", weights);
  console.log("prediction train input");
  console.log(predict(model, inputs));
  console.log("prediction with random input");
  console.log(predict(model, [
    [2000],
    [7],
    [123],
    [13],
  ]));
}();
