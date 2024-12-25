import { db } from '$lib/server/db';
import { userTable, type User } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const createUser = async (googleId: string, name: string): Promise<User> => {
	const [user] = await db.insert(userTable).values({ googleId, name }).returning();

	if (user === null) throw new Error('User not found');

	return user;
};

export async function getUserFromGoogleId(googleId: string): Promise<User | null> {
	const row = await db
		.select({
			id: userTable.id,
			googleId: userTable.googleId,
			name: userTable.name
		})
		.from(userTable)
		.where(eq(userTable.googleId, googleId))
		.limit(1);

	if (row === null || row.length === 0) {
		return null;
	}

	const user: User = {
		id: row[0].id,
		googleId: row[0].googleId,
		name: row[0].name
	};

	return user;
}
