import { abs, mat, mean, power, subM } from "./mat.ts";
export type lossFn = (expected: mat, actual: mat) => number;
export function meanAbsoluteError(targets: mat, predictions: mat) {
	return mean(abs(subM(targets, predictions)));
}
export function meanSquareError(targets: mat, predictions: mat) {
	return mean(power(subM(targets, predictions), 2));
}
