import { sum } from "../src/mat.js";
import { randomMInt } from "../src/utils.js";
import assert from "node:assert";

const row = 2;
const col = 5;
const min = 0;
const max = 5;
const test = randomMInt(row, col, min, max);
let expected = 0;
for (let i = 0; i < row; i++) {
	for (let j = 0; j < col; j++) {
		expected += test[i][j];
	}
}
assert.deepStrictEqual(sum(test), expected);
