import type { InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, date, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const junkLogTable = pgTable('junk_log', {
	id: serial('id').primaryKey(),
	description: text('description').notNull(),
	junkFree: boolean('junk_free'),
	date: date('date').notNull()
});

export const userTable = pgTable('user', {
	id: serial('id').primaryKey(),
	googleId: text('google_id'),
	name: text('name')
});

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type JunkLog = InferSelectModel<typeof junkLogTable>;
export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
