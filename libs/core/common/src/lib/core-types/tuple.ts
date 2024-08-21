export async function tuple<T, E = any>(promise: T | Promise<T>): Promise<[T, E]> {
	try {
		const data = await promise;
		return <[T, E]>[data, null];
	} catch (e) {
		return <[T, E]>[null, e];
	}
}
