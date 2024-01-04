import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
	ConfigModule.forRoot({
		isGlobal: true
	}),
	DbModule,
	AuthModule,
	UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
