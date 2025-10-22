import { db } from '$lib/server/db';
import { junkLogTable, type JunkLog } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const addJunkLog = async (food: JunkLog) => {
	await db.insert(junkLogTable).values(food);
};

export const deleteJunkLog = async (id: number) => {
	await db.delete(junkLogTable).where(eq(junkLogTable.id, id));
};

export const getAllJunkLogs = async () => {
	const allLogs = await db.select().from(junkLogTable);
	return { data: allLogs };
};
