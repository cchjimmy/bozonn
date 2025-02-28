import { findMinMaxM, mapM, percent } from "./utils.js";
export function softmax(inputs) {
	const [min, max] = findMinMaxM(inputs);
	return mapM(inputs, (v) => percent(min, max, v));
}
