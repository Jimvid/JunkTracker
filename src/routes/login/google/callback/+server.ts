import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/session';
import { google } from '$lib/server/oauth';
import { decodeIdToken } from 'arctic';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { createUser, getUserFromGoogleId } from '$lib/server/queries/user';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;

	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e: unknown) {
		// Invalid code or client credentials
		console.error(e);
		return new Response(null, {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken());
	// @ts-expect-error idk what type this should be yet
	const googleUserId = claims.sub;
	// @ts-expect-error idk what type this should be yet
	const username = claims.name;

	const existingUser = await getUserFromGoogleId(googleUserId);

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/dashboard'
			}
		});
	}

	const user = await createUser(googleUserId, username);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);

	setSessionTokenCookie(event, sessionToken, session.expiresAt);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/dashboard'
		}
	});
}