import { addJunkLog, getAllJunkLogs, deleteJunkLog } from '$lib/server/queries/junkLog';
import type { JunkLog } from '$lib/server/db/schema';

import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { generateYearContributions, type ContributionData } from '$lib/util';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, '/login');
	}

	const data = await getAllJunkLogs(event.locals.user.id);
	const numberOfContributions = data.data.length;

	const contributions: { [key: number]: ContributionData } = {
		2024: generateYearContributions(data.data, 2024)['2024'],
		2025: generateYearContributions(data.data, 2025)['2025']
	};

	return {
		contributions: contributions,
		numberOfContributions: numberOfContributions,
		logs: data.data
	};
};

export const actions = {
	addLog: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { unauthorized: true });

		const data = await request.formData();

		const description = data.get('description')?.toString() || '';

		const date = data.get('date')?.toString();
		if (!date) return fail(400, { date, missing: true });

		const junkFree = Boolean(data.get('junkfree'));

		const food = {
			date,
			description,
			junkFree
		} as JunkLog;

		await addJunkLog(food, locals.user.id);
	},
	deleteLog: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { unauthorized: true });

		const data = await request.formData();

		const id = data.get('id')?.toString();
		if (!id) return fail(400, { id, missing: true });

		await deleteJunkLog(Number(id), locals.user.id);
	}
} satisfies Actions;
