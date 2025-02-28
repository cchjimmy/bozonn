import { abs, mean, power, subM } from "./mat.js";
export function meanAbsoluteError(targets, predictions) {
	return mean(abs(subM(targets, predictions)));
}
export function meanSquareError(targets, predictions) {
	return mean(power(subM(targets, predictions), 2));
}
