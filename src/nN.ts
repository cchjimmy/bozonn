import { randomM } from "./utils.ts";
import { activationFn, identity, sigmoid } from "./activationFns.ts";
import { lossFn } from "./lossFns.ts";
import { mat } from "./mat.ts";
import { optimizer } from "./optimizers.ts";
export type model = { layers: layer[] };
export function createModel(...layers: layer[]) {
	return {
		layers,
	};
}
export function predict(model: model, inputs: mat) {
	for (let i = 0, m = model.layers.length; i < m; i++) {
		inputs = processLayer(model.layers[i], inputs);
	}
	return inputs;
}
const fns = [identity, sigmoid];
export function processLayer(layer: layer, inputs: mat) {
	const outRowLen = inputs.length;
	const outColLen = layer.weights[0].length;
	const matchLen = inputs[0].length + 1; // account for bias
	const output = new Array(outRowLen);
	for (let i = 0; i < outRowLen; i++) {
		output[i] = new Array(outColLen);
		inputs[i].push(1);
		for (let j = 0; j < outColLen; j++) {
			output[i][j] = 0;
			for (let k = 0; k < matchLen; k++) {
				output[i][j] += inputs[i][k] *
					layer.weights[k][j];
			}
			output[i][j] = fns[layer.activationFn](output[i][j]);
		}
		inputs[i].pop();
	}
	return output;
}
export type layer = { weights: mat; activationFn: number };
export function createLayer(
	inputLength: number,
	outputLength: number,
	activationFn: activationFn = identity,
) {
	// extra weight as the value of bias
	const weights = randomM(inputLength + 1, outputLength, -1, 1);
	return {
		weights,
		activationFn: fns.indexOf(activationFn),
	};
}
export function train(
	optimizer: optimizer,
	lossFn: lossFn,
	model: model,
	iterations: number,
	trainInputs: mat,
	trainOutputs: mat,
): number {
	console.log("training starts");
	let finalLoss = Infinity;
	for (let i = 0; i < iterations; i++) {
		finalLoss = optimizer(lossFn, model, trainInputs, trainOutputs);
		if (i % (iterations / 5) == 0) {
			console.log(`progress: ${(i / iterations) * 100}%`);
		}
	}
	console.log("progress: 100%\ntraining ends");
	return finalLoss;
}
export function getWeights(model: model) {
	return model.layers.map((x) => x.weights);
}
