import { mapM, reduceM } from "./utils.ts";
export type mat = number[][];
export function abs(m: mat) {
	return mapM(m, (v: number) => Math.abs(v));
}
export function sum(m: mat) {
	return reduceM(m, (accum: number, curr: number) => accum + curr, 0);
}
export function multM(m1: mat, m2: mat) {
	const outRowLen = m1.length;
	const outColLen = m2[0].length;
	const matchLen = m1[0].length;
	const result = new Array(outRowLen);
	for (let i = 0; i < m1.length; i++) {
		result[i] = new Array(outColLen);
		for (let j = 0; j < outColLen; j++) {
			result[i][j] = 0;
			for (let k = 0; k < matchLen; k++) {
				result[i][j] += m1[i][k] * m2[k][j];
			}
		}
	}
	return result;
}
export function addM(m1: mat, m2: mat) {
	return mapM(m1, (v, i, j) => v + m2[i][j]);
}
export function subM(m1: mat, m2: mat) {
	return mapM(m1, (v, i, j) => v - m2[i][j]);
}
// s stands for scalar
export function subS(m: mat, s: number) {
	return mapM(m, (v) => v - s);
}
export function multS(m: mat, s: number) {
	return mapM(m, (v) => v * s);
}
export function power(m: mat, exp: number) {
	return mapM(m, (v) => v ** exp);
}
export function mean(m: mat) {
	return sum(m) / (m.length * m[0].length);
}
