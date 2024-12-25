import { db } from '$lib/server/db';
import { junkLogTable, type JunkLog } from '$lib/server/db/schema';

export const addJunkLog = async (food: JunkLog) => {
	await db.insert(junkLogTable).values(food);
};

export const deleteJunkLog = async (food: JunkLog) => {
	await db.insert(junkLogTable).values(food);
};

export const getAllJunkLogs = async () => {
	const allLogs = await db.select().from(junkLogTable);
	return { data: allLogs };
};
