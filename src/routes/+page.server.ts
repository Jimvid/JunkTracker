import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// If user is logged in, redirect to dashboard
	if (event.locals.user !== null) {
		throw redirect(302, '/dashboard');
	}

	return {};
};
