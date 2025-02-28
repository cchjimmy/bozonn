export function identity(x) {
	return x;
}
export function sigmoid(x) {
	return 1 / (1 + Math.exp(-x));
}
