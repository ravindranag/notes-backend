import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { noteTable } from "./note";
import { userTable } from "./user";
import { primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const sharedNotesTable = pgTable('sharedNotes', {
	noteId: text('noteId').references(() => noteTable.id, {
		onDelete: 'cascade'
	}),
	userId: text('userId').references(() => userTable.id, {
		onDelete: 'cascade'
	})
}, (table) => ({
	pk: primaryKey({
		columns: [table.noteId, table.userId]
	})
}))

export const sharedNotesToNoteRelation = relations(sharedNotesTable, ({one}) => ({
	note: one(noteTable, {
		fields: [sharedNotesTable.noteId],
		references: [noteTable.id]
	})
}))

export const sharedNotesToUserRelation = relations(sharedNotesTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sharedNotesTable.userId],
		references: [userTable.id]
	})
}))

export type SharedNote = typeof sharedNotesTable.$inferSelect