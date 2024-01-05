import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { and, eq, or, sql } from 'drizzle-orm';
import { CreateNoteDto, UpdateNoteDto } from './note.dto';
import { noteTable } from '../../drizzle/schema/note';
import { sharedNotesTable } from '../../drizzle/schema/sharedNote';
import { DbProvider, DbClient } from '../db/db.module';

@Injectable()
export class NoteService {
	constructor(
		@Inject(DbProvider) private readonly db: DbClient
	) { }

	notesByUser(userId: string) {
		return this.db.select().from(noteTable).where(eq(noteTable.authorId, userId))
	}

	noteById(noteId: string, authorId: string) {
		return this.db.select().from(noteTable).where(and(eq(noteTable.id, noteId), eq(noteTable.authorId, authorId)))
	}

	async createNewNote(data: CreateNoteDto, authorId: string) {
		const newNote = await this.db.insert(noteTable).values({
			...data,
			authorId
		}).returning()
		return {
			message: 'Note created successfully',
			note: newNote[0]
		}
	}

	async updateNote(noteId: string, authorId: string, data: UpdateNoteDto) {
		try {
			const updatedNote = await this.db
				.update(noteTable)
				.set({
					...data,
					updatedAt: (new Date()).toISOString()
				})
				.where(and(eq(noteTable.id, noteId), eq(noteTable.authorId, authorId)))
				.returning()
			return updatedNote[0]
		}
		catch (e) {
			throw new BadRequestException('Update failed')
		}
	}

	async deleteNote(noteId: string, authorId: string) {
		try {
			await this.db.delete(noteTable).where(and(eq(noteTable.id, noteId), eq(noteTable.authorId, authorId)))
			return {
				message: 'Note deleted successfully'
			}
		}
		catch (e) {
			throw new BadRequestException('Cannot delete note')
		}
	}

	async shareNoteWithUser(noteId: string, authorId: string, userIdList: string[]) {
		const note = await this.noteById(noteId, authorId)

		if (!note) {
			throw new UnauthorizedException('Only author is allowed to share this note.')
		}

		try {

			await this.db.insert(sharedNotesTable).values(userIdList.map((userId) => ({
				noteId: noteId,
				userId
			})))

			return {
				message: 'Note shared with user successfully.'
			}
		}
		catch (e) {
			throw new BadRequestException('Failed to shared note with user.')
		}
	}

	searchNoteByTitleContent(query: string, userId: string) {
		return this.db
			.select()
			.from(noteTable)
			.where(and(
				eq(noteTable.authorId, userId),
				or(
					sql`to_tsvector('simple', ${noteTable.title}) @@ to_tsquery('simple', ${query})`,
					sql`to_tsvector('simple', ${noteTable.content}) @@ to_tsquery('simple', ${query})`,
				)
			))
	}
}
