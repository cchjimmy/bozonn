import {
	createLayer,
	createModel,
	evolution,
	getGradients,
	getWeights,
	gradientDescent,
	meanAbsoluteError,
	meanSquareError,
	predict,
	train,
} from "../build/bozonn.js";
import { copyModel, loadModel, saveModel } from "./trainer.js";
const inputs = [
	[0],
	[10],
	[-5],
	[13],
	[99],
];
function f(x) {
	return x + 2;
}
const outputs = new Array(inputs.length);
for (let i = 0, m = inputs.length; i < m; i++) {
	outputs[i] = new Array(inputs[i].length);
	for (let j = 0, n = inputs[i].length; j < n; j++) {
		outputs[i][j] = f(inputs[i][j]);
	}
}
const filePath = "./models/add2Model.json";
let model = await loadModel(filePath);
model ??= createModel(createLayer(1, 1));
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
const testInput = random2D(10, 1, 0, 5);
console.log(testInput);
console.log("predictions (gradientDescent):");
console.log(predict(model, testInput));
console.log("predictions (evolution):");
console.log(predict(model1, testInput));
saveModel(trainError > trainError1 ? model1 : model, filePath);

function random2D(row, col, min, max) {
	const result = new Array(row);
	for (let i = 0; i < row; i++) {
		result[i] = new Array(col);
		for (let j = 0; j < col; j++) {
			result[i][j] = min + Math.random() * (max - min);
			result[i][j] = Math.floor(result[i][j]);
		}
	}
	return result;
}
