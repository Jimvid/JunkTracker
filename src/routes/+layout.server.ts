import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const isLoggedIn = event.locals.user !== null;

	return { isLoggedIn };
};
