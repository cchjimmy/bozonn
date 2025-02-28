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

	for (let i = 0, m = times.length; i < m; i++) {
		const time = times[i].sort();
		let index = (iterations - 1) * 0.99;
		const p99 = (time[Math.floor(index)] + time[Math.ceil(index)]) /
			2;
		index = (iterations - 1) * 0.90;
		const p90 = (time[Math.floor(index)] + time[Math.ceil(index)]) /
			2;
		index = (iterations - 1) * 0.50;
		const p50 = (time[Math.floor(index)] + time[Math.ceil(index)]) /
			2;
		console.log(
			"p99: " + p99 + ", p90: " + p90 + ", p50: " + p50,
		);
	}
}
