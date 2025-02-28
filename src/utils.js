export function random(min, max) {
	return Math.random() * (max - min) + min;
}
export function randomM(m, n, min, max) {
	min ??= -1;
	max ??= 1;
	const result = new Array(m);
	for (let i = 0; i < m; i++) {
		result[i] = new Array(n);
		for (let j = 0; j < n; j++) {
			result[i][j] = random(min, max);
		}
	}
	return result;
}
export function randomMInt(m, n, min, max) {
	min ??= -1;
	max ??= 1;
	const result = new Array(m);
	for (let i = 0; i < m; i++) {
		result[i] = new Array(n);
		for (let j = 0; j < n; j++) {
			result[i][j] = Math.floor(
				min + Math.random() * (max - min),
			);
		}
	}
	return result;
}
export function derivative1D(fn, x, halfStepSize) {
	// midpoint method
	halfStepSize ??= 1e-8;
	return (fn(x + halfStepSize) - fn(x - halfStepSize)) /
		(2 * halfStepSize);
}
export function fillM(m, n, value) {
	value ??= 0;
	const result = new Array(m);
	const row = new Array(n).fill(value);
	for (let i = 0; i < m; i++) {
		result[i] = row.slice();
	}
	return result;
}
export function copyM(from, to) {
	mapM(from, (x, i, j) => to[i][j] = x);
}
export function findMinMaxM(m) {
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
export function percent(min, max, current) {
	return (current - min) / (max - min);
}
export function mapM(m, callback) {
	return m.map((element, index) =>
		element.map((element1, index1) =>
			callback(element1, index, index1)
		)
	);
}
export function mapM2(m, callback) {
	return reduceM(
		m,
		(accum, curr, i, j) => {
			if (j == 0) accum[i] = new Array(m[i].length);
			accum[i][j] = callback(curr, i, j);
			return accum;
		},
		new Array(m.length),
	);
}
export function reduceM(m, callback, accumulator) {
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
