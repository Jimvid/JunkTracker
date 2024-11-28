import { pgTable, serial, text, date, boolean } from 'drizzle-orm/pg-core';

export const foodLogsTable = pgTable('food_logs', {
	id: serial('id').primaryKey(),
	description: text('description').notNull(),
	junkFree: boolean('junk_free'),
	date: date('date').notNull()
});
