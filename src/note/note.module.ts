import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { DbModule } from 'src/db/db.module';
import { NoteController } from './note.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [NoteService],
  imports: [
	DbModule,
	AuthModule,
	UserModule
  ],
  controllers: [NoteController],

})
export class NoteModule {}
