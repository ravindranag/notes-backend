import { createId } from "@paralleldrive/cuid2";
import { timestamp } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { relations } from "drizzle-orm";

export const noteTable = pgTable('note', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
	title: text('title').default('Untitled'),
	content: text('content'),
	createdAt: timestamp('createdAt', {
		withTimezone: true,
		mode: 'string'
	}).defaultNow(),
	updatedAt: timestamp('updatedAt', {
		withTimezone: true,
		mode: 'string'
	}).defaultNow(),
	authorId: text('authorId').references(() => userTable.id, {
		onDelete: 'cascade'
	})
})

export const noteToUserRelation = relations(noteTable, ({ one }) => ({
	author: one(userTable, {
		fields: [noteTable.authorId],
		references: [userTable.id]
	})
}))

export type Note = typeof noteTable.$inferSelect
export type CreateNote = typeof noteTable.$inferInsert
