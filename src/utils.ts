import { mat } from "./mat.ts";

export function random(min: number = 0, max: number = 1) {
	return Math.random() * (max - min) + min;
}
export function randomM(
	m: number,
	n: number,
	min: number = 0,
	max: number = 1,
) {
	const result = new Array(m);
	for (let i = 0; i < m; i++) {
		result[i] = new Array(n);
		for (let j = 0; j < n; j++) {
			result[i][j] = random(min, max);
		}
	}
	return result;
}
export function derivative1D(
	fn: (x: number) => number,
	x: number,
	halfStepSize: number = 1e-8,
) {
	// midpoint method
	return (fn(x + halfStepSize) - fn(x - halfStepSize)) /
		(2 * halfStepSize);
}
export function fillM(m: number, n: number, value: number = 0) {
	const result = new Array(m);
	const row = new Array(n).fill(value);
	for (let i = 0; i < m; i++) {
		result[i] = row.slice();
	}
	return result;
}
export function copyM(from: mat, to: mat) {
	mapM(from, (x: number, i, j) => to[i][j] = x);
}
export function findMinMaxM(m: mat) {
	let min = Number.POSITIVE_INFINITY;
	let max = Number.NEGATIVE_INFINITY;
	for (let i = 0, x = m.length; i < x; i++) {
		for (let j = 0, y = m[i].length; j < y; j++) {
			const v = m[i][j];
			min = v < min ? v : min;
			max = v > max ? v : max;
		}
	}
	return [min, max];
}
export function percent(min: number, max: number, current: number) {
	return (current - min) / (max - min);
}
export function mapM(
	m: mat,
	callback: (curr: number, row: number, col: number) => number,
) {
	return m.map((element, index) =>
		element.map((element1, index1) => callback(element1, index, index1))
	);
}
export function reduceM(
	m: mat,
	callback: (accum: any, curr: number, row: number, col: number) => number,
	accumulator: any,
) {
	return m.reduce(
		(accum, current, index) =>
			current.reduce(
				(accum1, current1, index1) =>
					callback(
						accum1,
						current1,
						index,
						index1,
					),
				accum,
			),
		accumulator,
	);
}
