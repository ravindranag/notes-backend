import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { noteTable } from "./note";

export const userTable = pgTable('user', {
	id: text('id').primaryKey().$defaultFn(() => createId()),
	email: text('email').unique().notNull(),
	password: text('password').notNull(),
	name: text('name').notNull()
})

export const userToNoteRelation = relations(userTable, ({ many }) => ({
	notes: many(noteTable)
}))

export type CreateUser = typeof userTable.$inferInsert
export type User = typeof userTable.$inferSelect