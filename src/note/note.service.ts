import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { CreateNote, noteTable } from 'drizzle/schema/note';
import { DbClient, DbProvider } from 'src/db/db.module';
import { CreateNoteDto, UpdateNoteDto } from './note.dto';

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
}
