export const PROMISE_TIMEOUT = 'timeout';

export function tPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
	const timeout = new Promise<T>((_, reject) => {
		setTimeout(() => {
			reject(new Error(PROMISE_TIMEOUT));
		}, ms);
	});

	return Promise.race([promise, timeout]);
}
