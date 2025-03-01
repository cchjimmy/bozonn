import { mat } from "./mat.ts";
import { findMinMaxM, mapM, percent } from "./utils.ts";

export function softmax(inputs: mat) {
	const [min, max] = findMinMaxM(inputs);
	return mapM(inputs, (v: number) => percent(min, max, v));
}
