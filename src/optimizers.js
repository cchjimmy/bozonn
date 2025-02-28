import { addM, multS, subM } from "./mat.js";
import { derivative1D, randomM } from "./utils.js";
import { predict, processLayer } from "./nN.js";
// TODO: finish gradient descent
function gradientDescent(stepSize) {
	return (lossFn, model, trainInputs, trainOutputs) => {
		// forward pass
		const prediction = predict(model, trainInputs);
		return lossFn(trainOutputs, predict(model, trainInputs));
	};
}
export function evolution(stepSize, maxTries) {
	maxTries ??= 100;
	return (lossFn, model, trainInputs, trainOutputs) => {
		const loss = lossFn(trainOutputs, predict(model, trainInputs));
		if (loss < stepSize) return loss;
		const oldWs = model.layers.map((layer) => layer.weights);
		for (let t = 0; t < maxTries; t++) {
			let prediction = trainInputs;
			for (let i = 0, m = oldWs.length; i < m; i++) {
				model.layers[i].weights = addM(
					oldWs[i],
					randomM(
						oldWs[i].length,
						oldWs[i][0].length,
						-stepSize,
						stepSize,
					),
				);
				prediction = processLayer(
					model.layers[i],
					prediction,
				);
			}
			const childLoss = lossFn(
				trainOutputs,
				prediction,
			);
			if (loss > childLoss) return childLoss;
		}
		for (let i = 0, m = oldWs.length; i < m; i++) {
			model.layers[i].weights = oldWs[i];
		}
		return loss;
	};
}
