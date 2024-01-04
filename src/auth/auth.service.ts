import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { CreateUser, userTable } from 'drizzle/schema/user';
import { DbClient, DbProvider } from 'src/db/db.module';

@Injectable()
export class AuthService {
	constructor(
		@Inject(DbProvider) private readonly db: DbClient
	) { }

	async createNewUser(data: CreateUser) {
		try {
			const hashedPassword = await hash(data.password)

			await this.db.insert(userTable).values({
				...data,
				password: hashedPassword
			})
			return {
				message: 'Sign up successful. Continue to login'
			}
		}
		catch (e) {
			throw new BadRequestException('User creation failed')
		}
	}

}


