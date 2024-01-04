import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';
import { CreateNoteDto, UpdateNoteDto } from './note.dto';

@Controller('notes')
export class NoteController {
	constructor(
		private readonly noteService: NoteService
	) {}

	@Get()
	@UseGuards(JwtGuard)
	getNoteListForUser(@Req() req: Request) {
		return this.noteService.notesByUser(req.user.id)
	}

	@Post()
	@UseGuards(JwtGuard)
	createNewNoteForUser(@Body() data: CreateNoteDto, @Req() req: Request) {
		return this.noteService.createNewNote(data, req.user.id)
	}

	@Get(':noteId')
	@UseGuards(JwtGuard)
	getNoteForUser(@Req() req: Request, @Param('noteId') noteId: string) {
		return this.noteService.noteById(noteId, req.user.id)
	}

	@Put(':noteId')
	@UseGuards(JwtGuard)
	updateNoteById(@Req() req: Request, @Param('noteId') noteId: string, @Body() data: UpdateNoteDto) {
		return this.noteService.updateNote(noteId, req.user.id, data)
	}

	@Delete(':noteId')
	@UseGuards(JwtGuard)
	deleteNoteById(@Req() req: Request, @Param('noteId') noteId: string) {
		return this.noteService.deleteNote(noteId, req.user.id)
	}
	
}
