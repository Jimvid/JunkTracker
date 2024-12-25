import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from './lib/server/session';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('auth_session') ?? null;

	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;

		if (event.url.pathname.startsWith('/dashboard')) {
			return new Response('Redirect', {
				status: 303,
				headers: { Location: '/login' }
			});
		}
		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);

	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.session = session;
	event.locals.user = user;

	return resolve(event);
};
