import { meanSquareError } from "../src/lossFns.ts";
import { createDenseLayer, createModel, predict, train } from "../src/nN.ts";
import { evolution, gradientDescent } from "../src/optimizers.ts";
import { mapM, randomM } from "../src/utils.ts";
import { copyModel, loadModel, saveModel } from "./trainer.ts";
const inputs = [
	[0],
	[10],
	[-5],
	[13],
	[99],
];
function f(x: number) {
	return x + 2;
}
const outputs = new Array(inputs.length);
for (let i = 0, m = inputs.length; i < m; i++) {
	outputs[i] = new Array(inputs[i].length);
	for (let j = 0, n = inputs[i].length; j < n; j++) {
		outputs[i][j] = f(inputs[i][j]);
	}
}
const filePath = "../models/add2Model.json";
let model = await loadModel(filePath);
model ??= createModel(createDenseLayer(1, 1));
const model1 = copyModel(model);
const trainError = train(
	gradientDescent(1e-4),
	meanSquareError,
	model,
	1000,
	inputs,
	outputs,
);
const trainError1 = train(
	evolution(1e-4),
	meanSquareError,
	model1,
	1000,
	inputs,
	outputs,
);
console.log("error after training (gradientDescent): " + trainError);
console.log("error after training (evolution): " + trainError1);
console.log("Test input:");
const testInput = mapM(randomM(10, 1, 0, 5), (x) => Math.floor(x));
console.log(testInput);
console.log("predictions (gradientDescent):");
console.log(predict(model, testInput));
console.log("predictions (evolution):");
console.log(predict(model1, testInput));
saveModel(trainError > trainError1 ? model1 : model, filePath);
