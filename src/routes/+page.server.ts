import { getAllJunkfoodLogs } from '$lib/server/queries/foodLog';

export const prerender = true;

export async function load() {
	const data = await getAllJunkfoodLogs();
	return { ...data };
}
