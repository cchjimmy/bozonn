function quartile(data1D, fraction) {
	const index = (data1D.length - 1) * fraction;
	return (data1D[Math.floor(index)] + data1D[Math.ceil(index)]) / 2;
}
export function bench(candidates, iterations) {
	const times = new Array(candidates.length);
	for (let i = 0, m = candidates.length; i < m; i++) {
		times[i] = new Array(iterations);
		for (let j = 0; j < iterations; j++) {
			const time = performance.now();
			candidates[i]();
			times[i][j] = performance.now() - time;
		}
	}

	let output = "";
	for (let i = 0, m = times.length; i < m; i++) {
		const time = times[i].sort();
		output += "p99: " + quartile(time, 0.99) + ", p90: " +
			quartile(time, 0.9) + ", p50: " +
			quartile(time, 0.5) + "\n";
	}
	console.log(output);
}
