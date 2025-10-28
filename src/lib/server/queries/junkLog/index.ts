import { db } from '$lib/server/db';
import { junkLogTable, type JunkLog } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const addJunkLog = async (food: JunkLog, userId: number) => {
	await db.insert(junkLogTable).values({ ...food, userId });
};

export const deleteJunkLog = async (id: number, userId: number) => {
	await db.delete(junkLogTable).where(and(eq(junkLogTable.id, id), eq(junkLogTable.userId, userId)));
};

export const getAllJunkLogs = async (userId: number) => {
	const allLogs = await db.select().from(junkLogTable).where(eq(junkLogTable.userId, userId));
	return { data: allLogs };
};
