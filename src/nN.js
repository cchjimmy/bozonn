import { randomM } from "./utils.js";
import { identity, sigmoid } from "./activationFns.js";
export function createModel(...layers) {
	return {
		layers,
	};
}
export function predict(model, inputs) {
	for (let i = 0, m = model.layers.length; i < m; i++) {
		inputs = processLayer(model.layers[i], inputs);
	}
	return inputs;
}
const fns = [identity, sigmoid];
export function processLayer(layer, inputs) {
	const outRowLen = inputs.length;
	const outColLen = layer.weights[0].length;
	const matchLen = inputs[0].length + 1; // account for bias
	const output = new Array(outRowLen);
	for (let i = 0; i < outRowLen; i++) {
		output[i] = new Array(outColLen);
		// extra input = bias of output node
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
export function createLayer(inputLength, outputLength, activationFn) {
	// extra weight as the value of bias
	const weights = randomM(inputLength + 1, outputLength, -1, 1);
	activationFn ??= identity;
	return {
		weights,
		activationFn: fns.indexOf(activationFn),
	};
}
export function train(
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
			console.log(`progress: ${(i / iterations) * 100}%`);
		}
	}
	console.log("progress: 100%\ntraining ends");
	return finalLoss;
}
export function getWeights(model) {
	return model.layers.map((x) => x.weights);
}
