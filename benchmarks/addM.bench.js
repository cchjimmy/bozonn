import { addM } from "../src/mat.js";
import { fillM } from "../src/utils.js";
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
function addMDoubleMap(m1, m2) {
	return m1.map((x, i) => x.map((x1, j) => x1 + m2[i][j]));
}
const row = 500;
const col = 500;
const inputs = fillM(row, col, 10);
const outputs = fillM(row, col, 2);
const candidates = [
	() => addM(inputs, outputs),
	() => vanillaAddM(inputs, outputs),
	() => addMReduceNative(inputs, outputs),
	() => addMDoubleMap(inputs, outputs),
];
const iterations = 1000;

bench(candidates, iterations);
