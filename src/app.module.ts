import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
	ConfigModule.forRoot({
		isGlobal: true,
		envFilePath: `.env.${process.env.NODE_ENV}`
	}),
	DbModule,
	AuthModule,
	UserModule,
	NoteModule,
	ThrottlerModule.forRoot([{
		ttl: 60_000,
		limit: 60
	}])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
