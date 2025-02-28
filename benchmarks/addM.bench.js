import { addM } from "../src/mat.js";
import { fillM, mapM2 } from "../src/utils.js";
import { bench } from "./bench.js";

function vanillaAddM(m1, m2) {
	const rowLen = m1.length;
	const colLen = m1[0].length;
	const result = new Array(rowLen);
	for (let i = 0; i < rowLen; i++) {
		result[i] = new Array(colLen);
		for (let j = 0; j < colLen; j++) {
			result[i][j] = m1[i][j] + m2[i][j];
		}
	}
	return result;
}
function addMReduceNative(m1, m2) {
	const rowLen = m1.length;
	const colLen = m1[0].length;
	const result = new Array(rowLen);
	for (let i = 0; i < rowLen; i++) {
		m1[i].reduce(
			(acc, cur, j) => {
				acc[j] = cur + m2[i][j];
				return acc;
			},
			result[i] = new Array(colLen),
		);
	}
	return result;
}
function addMReduceNative2(m1, m2) {
	return mapM2(m1, (x, i, j) => x + m2[i][j]);
}
const inputs = fillM(100, 100, 10);
const outputs = fillM(100, 100, 2);
const candidates = [
	() => addM(inputs, outputs),
	() => vanillaAddM(inputs, outputs),
	() => addMReduceNative(inputs, outputs),
	() => addMReduceNative2(inputs, outputs),
];
const iterations = 10000;

bench(candidates, iterations);
