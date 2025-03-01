import { sum } from "../src/mat.js";
import { bench } from "./bench.js";
import { mapM, randomM } from "../src/utils.js";

function vanillaSum(mat) {
	let expected = 0;
	for (let i = 0, m = mat.length; i < m; i++) {
		for (let j = 0, n = mat[i].length; j < n; j++) {
			expected += mat[i][j];
		}
	}
	return expected;
}
function innerReduce(mat) {
	let expected = 0;
	for (let i = 0, m = mat.length; i < m; i++) {
		const innerSum = 0;
		expected += mat[i].reduce(
			(accum, curr) => accum + curr,
			innerSum,
		);
	}
	return expected;
}
function mapMSum(mat) {
	let result = 0;
	mapM(mat, (element) => result += element);
	return result;
}
function innerMap(mat) {
	let result = 0;
	for (let i = 0, m = mat.length; i < m; i++) {
		mat[i].map((x) => result += x);
	}
	return result;
}
function sumDoubleReduce(mat) {
	return mat.reduce(
		(accum, curr) =>
			curr.reduce((accum1, curr1) => accum1 + curr1, accum),
		0,
	);
}
const test = randomM(500, 500);
const candidates = [
	() => sum(test),
	() => vanillaSum(test),
	() => innerReduce(test),
	() => mapMSum(test),
	() => innerMap(test),
	() => sumDoubleReduce(test),
];
const iterations = 1000;

bench(candidates, iterations);
