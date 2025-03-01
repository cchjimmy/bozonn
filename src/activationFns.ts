export type activationFn = (x: number) => number;
export function identity(x: number) {
	return x;
}
export function sigmoid(x: number) {
	return 1 / (1 + Math.exp(-x));
}
export function relu(x: number) {
	return Math.max(0, x);
}
