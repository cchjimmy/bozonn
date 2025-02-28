import {
	createLayer,
	createModel,
	evolution,
	meanAbsoluteError,
	meanSquareError,
	predict,
	train,
} from "./build/bozonn.js";
import fs from "node:fs/promises";
import { derivative1D } from "./src/utils.js";
const inputs = [
	[0],
	[10],
	[-5],
	[13],
	[99],
];
const outputs = new Array(inputs.length);
for (let i = 0, m = inputs.length; i < m; i++) {
	outputs[i] = new Array(inputs[i].length);
	for (let j = 0, n = inputs[i].length; j < n; j++) {
		outputs[i][j] = inputs[i][j] + 2;
	}
}
const filePath = "./models/add2Model.json";
let modelContent = null;
try {
	modelContent = await fs.readFile(filePath, { encoding: "utf8" });
} catch {
	console.log("File '" + filePath + "' does not exist.");
}
const model = modelContent
	? JSON.parse(modelContent)
	: createModel(createLayer(1, 1));
const trainError = train(
	evolution(0.0000001),
	meanAbsoluteError,
	model,
	100000,
	inputs,
	outputs,
);
console.log("error after training: " + trainError);
console.log("Test input:");
const testInput = random2D(10, 1, 0, 5);
console.log(testInput);
console.log("predictions:");
console.log(predict(model, testInput));
fs.writeFile(filePath, JSON.stringify(model));

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
