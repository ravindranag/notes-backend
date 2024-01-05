import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService
	) {}

	@Get('search')
	@UseGuards(JwtGuard)
	searchForUser(@Query('q') query: string, @Query('limit') limit: number = 20, @Query('page') page: number = 1) {
		return this.userService.searchUserByName(query, page, limit)
	}
}
