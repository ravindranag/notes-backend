import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser } from '../../drizzle/schema/user';
import { LoginDto } from './auth.dto';
import { JwtGuard } from './jwt/jwt.guard';
import { Request } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService
	) {}

	@Post('signup')
	handleSignUp(@Body() data: CreateUser) {
		return this.authService.createNewUser(data)
	}

	@Post('login')
	handleLogin(@Body() data: LoginDto) {
		return this.authService.verifyUserAndCreateToken(data)
	}

	
	@Get('me')
	@UseGuards(JwtGuard)
	getCurrentUser(@Req() req: Request) {
		return req['user']

	}

}
