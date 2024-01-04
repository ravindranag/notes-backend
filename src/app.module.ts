import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [
	ConfigModule.forRoot({
		isGlobal: true
	}),
	DbModule,
	AuthModule,
	UserModule,
	NoteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
