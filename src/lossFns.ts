import { mat } from "./mat.ts";
import { reduceM } from "./utils.ts";
export type lossFn = (expected: mat, actual: mat) => number;
export function meanAbsoluteError(targets: mat, predictions: mat) {
	return reduceM(
		targets,
		(accum, curr, i, j) => accum += curr - predictions[i][j],
		0,
	) / (targets.length * targets[0].length);
}
export function meanSquareError(targets: mat, predictions: mat) {
	return reduceM(
		targets,
		(accum, curr, i, j) => accum += (curr - predictions[i][j]) ** 2,
		0,
	) / (targets.length * targets[0].length);
}
