import { db } from '$lib/server/db';
import { foodLogsTable } from '$lib/server/db/schema';

export type Food = typeof foodLogsTable.$inferInsert;

export const addJunkfoodLog = async (food: Food) => {
	await db.insert(foodLogsTable).values(food);
};

export const deleteJunkfoodLog = async (food: Food) => {
	await db.insert(foodLogsTable).values(food);
};

export const getAllJunkfoodLogs = async () => {
	const allLogs = await db.select().from(foodLogsTable);
	return { data: allLogs };
};
