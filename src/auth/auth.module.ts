import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbModule } from 'src/db/db.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt/jwt.guard';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
  imports: [
	DbModule,
	JwtModule.register({
		secret: process.env.JWT_SECRET,
		signOptions: {
			expiresIn: '7d'
		},
		global: true
	}),
	UserModule
  ],
  exports: [JwtGuard]
})
export class AuthModule {}
