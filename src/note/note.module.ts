import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { DbModule } from '../db/db.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [NoteService],
  imports: [
	DbModule,
	AuthModule,
	UserModule
  ],
  controllers: [NoteController],
  exports: [NoteService]
})
export class NoteModule {}
