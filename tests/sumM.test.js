import { sum } from "../src/mat.js";
import { randomM } from "../src/utils.js";
import assert from "node:assert";

const test = randomM(2, 5);
let expected = 0;
for (let i = 0, row = test.length; i < row; i++) {
	for (let j = 0, col = test[i].length; j < col; j++) {
		expected += test[i][j];
	}
}
assert.deepStrictEqual(sum(test), expected);
