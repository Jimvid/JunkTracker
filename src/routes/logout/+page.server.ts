import { fail, redirect, type Actions } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/session';

export const actions: Actions = {
	default: async (event) => {
		if (event.locals.session === null) {
			return fail(401, { message: 'Unauthorized' });
		}

		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		throw redirect(303, '/');
	}
};
