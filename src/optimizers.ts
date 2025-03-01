import { derivative1D, mapM, random } from "./utils.ts";
import { predict, processLayer } from "./nN.ts";
import { lossFn } from "./lossFns.ts";
import { model } from "./nN.ts";
import { mat } from "./mat.ts";
export type optimizer = (
	lossFn: lossFn,
	model: model,
	trainInputs: mat,
	trainOutputs: mat,
) => number;
export function getGradients(
	lossFn: lossFn,
	model: model,
	trainInputs: mat,
	trainOutputs: mat,
) {
	const layerLen = model.layers.length;
	// forward pass
	const activations = new Array(layerLen);
	activations[0] = processLayer(model.layers[0], trainInputs);
	for (let i = 1; i < layerLen; i++) {
		activations[i] = processLayer(
			model.layers[i],
			activations[i - 1],
		);
	}
	// backward pass
	const gradients = new Array(layerLen);
	for (let i = layerLen - 1; i >= 0; i--) {
		const input = i == 0 ? trainInputs : activations[i - 1];
		gradients[i] = mapM(
			model.layers[i].weights,
			(x, row, col) =>
				derivative1D(
					(x) => {
						const old = model.layers[i].weights[row][col];
						model.layers[i].weights[row][col] = x;
						let prediction = input;
						for (let j = i; j < layerLen; j++) {
							prediction = processLayer(
								model.layers[j],
								prediction,
							);
						}
						model.layers[i].weights[row][col] = old;
						return lossFn(
							trainOutputs,
							prediction,
						);
					},
					x,
				),
		);
	}
	return gradients;
}
export function gradientDescent(
	stepSize: number,
	maxTries: number = 100,
): optimizer {
	return (
		lossFn: lossFn,
		model: model,
		trainInputs: mat,
		trainOutputs: mat,
	) => {
		const gradients = getGradients(
			lossFn,
			model,
			trainInputs,
			trainOutputs,
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
						return x - (gradients[i][row][col]) * newStepSize;
					},
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
export function evolution(stepSize: number, maxTries: number = 100): optimizer {
	return (
		lossFn: lossFn,
		model: model,
		trainInputs: mat,
		trainOutputs: mat,
	) => {
		const beginLoss = lossFn(
			trainOutputs,
			predict(model, trainInputs),
		);
		const layerLen = model.layers.length;
		const oldWs = model.layers.map((l) => l.weights);
		for (let t = 0; t < maxTries; t++) {
			let prediction = trainInputs;
			for (let i = 0; i < layerLen; i++) {
				model.layers[i].weights = mapM(
					oldWs[i],
					(x) =>
						x + random(
							-stepSize,
							stepSize,
						),
				);
				prediction = processLayer(
					model.layers[i],
					prediction,
				);
			}
			const endLoss = lossFn(trainOutputs, prediction);
			if (endLoss < beginLoss) return endLoss;
		}
		model.layers.map((l, i) => l.weights = oldWs[i]);
		return beginLoss;
	};
}
