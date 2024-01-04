import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUser } from 'drizzle/schema/user';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService
	) {}

	@Post('signup')
	handleSignUp(@Body() data: CreateUser) {
		return this.authService.createNewUser(data)
	}

}
