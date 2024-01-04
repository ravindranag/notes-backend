import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuard } from './auth/jwt/jwt.guard';
import { Request } from 'express';
import { NoteService } from './note/note.service';

@Controller()
export class AppController {
  constructor(
	private readonly appService: AppService,
	private readonly noteService: NoteService
	) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('search')
  @UseGuards(JwtGuard)
  searchNotesByUser(@Req() req: Request, @Query('q') query: string) {
	return this.noteService.searchNoteByTitleContent(query, req.user.id)
  }
}
