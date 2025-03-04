import { randomM } from "./utils.ts";
import { activationFn, identity, relu, sigmoid } from "./activationFns.ts";
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
const activationFns = [identity, sigmoid, relu];
const processFns = [denseLayerProcessFn, convLayerProcessFn];
export type layer = { weights: mat; activationFn: number; processFn: number };
export function processLayer(layer: layer & any, inputs: mat) {
	return processFns[layer.processFn](layer, inputs);
}
function denseLayerProcessFn(layer: layer, inputs: mat) {
	const outRowLen = inputs.length;
	const outColLen = layer.weights[0].length;
	const matchLen = inputs[0].length + 1; // account for bias
	const output = new Array(outRowLen);
	const row = new Array(outColLen).fill(0);
	for (let i = 0; i < outRowLen; i++) {
		output[i] = row.slice();
		inputs[i].push(1);
		for (let j = 0; j < outColLen; j++) {
			for (let k = 0; k < matchLen; k++) {
				output[i][j] += inputs[i][k] *
					layer.weights[k][j];
			}
			output[i][j] = activationFns[layer.activationFn](output[i][j]);
		}
		inputs[i].pop();
	}
	return output;
}
export function createDenseLayer(
	inputLength: number,
	outputLength: number,
	activationFn: activationFn = identity,
): layer {
	// extra weight as the value of bias
	const weights = randomM(inputLength + 1, outputLength, -1, 1);
	return {
		weights,
		activationFn: activationFns.indexOf(activationFn),
		processFn: processFns.indexOf(denseLayerProcessFn),
	};
}
function convLayerProcessFn(
	layer: layer & { padding: number; stride: number },
	input: mat,
) {
	const filterRow = layer.weights.length;
	const filterCol = layer.weights[0].length;
	const inRow = input.length;
	const inCol = input[0].length;
	const outRow = (inRow + layer.padding * 2 - filterRow) / layer.stride + 1;
	const outCol = (inCol + layer.padding * 2 - filterCol) / layer.stride + 1;
	const halfRowDiff = (outRow - inRow) / 2;
	const halfColDiff = (outCol - inCol) / 2;
	const out = new Array(outRow);
	const row = new Array(outCol).fill(0);
	for (let i = 0; i < outRow; i++) {
		out[i] = row.slice();
		for (let j = 0; j < outCol; j++) {
			for (let k = 0; k < filterRow; k++) {
				for (let l = 0; l < filterCol; l++) {
					const rowIdx = (i - halfRowDiff) * layer.stride + k - 1;
					const colIdx = (j - halfColDiff) * layer.stride + l - 1;
					// this means padded value is 0
					if (!(input[rowIdx] && input[rowIdx][colIdx])) continue;
					out[i][j] += input[rowIdx][colIdx] *
						layer.weights[k][l];
				}
			}
		}
	}
	return out;
}
export function createConvLayer(
	filterRow: number = 3,
	filterCol: number = 3,
	padding: number = 1,
	stride: number = 1,
	activationFn: activationFn = identity,
): layer & { padding: number; stride: number } {
	const weights = randomM(filterRow, filterCol, -1, 1);
	return {
		weights,
		activationFn: activationFns.indexOf(activationFn),
		processFn: processFns.indexOf(convLayerProcessFn),
		padding,
		stride,
	};
}
