import { mapM, mapM2, randomM } from "../src/utils.js";
import assert from "node:assert";

const row = 2;
const col = 5;
const min = 0;
const max = 10;
const test = randomM(row, col, min, max);
const expected = new Array(row);
for (let i = 0; i < row; i++) {
	expected[i] = new Array(col);
	for (let j = 0; j < col; j++) {
		expected[i][j] = test[i][j] * 2;
	}
}
function mult2(element) {
	return element * 2;
}
assert.deepStrictEqual(mapM(test, mult2), expected);
assert.deepStrictEqual(mapM2(test, mult2), expected);
