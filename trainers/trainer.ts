import fs from "node:fs/promises";
import { model } from "../src/nN.ts";

export async function loadModel(filePath: string) {
	console.log(`Loading model from '${filePath}'.`);
	let model;
	try {
		model = await fs.readFile(filePath, { encoding: "utf8" });
	} catch {
		console.warn(`File at '${filePath}' does not exist.`);
	}
	return model ? JSON.parse(model) : model;
}

export function saveModel(model: model, filePath: string) {
	console.log(`Saving model at '${filePath}'.`);
	fs.writeFile(filePath, JSON.stringify(model));
}

export function copyModel(model: model): model {
	return JSON.parse(JSON.stringify(model));
}
