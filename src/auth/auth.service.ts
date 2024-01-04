import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { CreateUser, userTable } from '../../drizzle/schema/user';
import { DbClient, DbProvider } from 'src/db/db.module';
import { LoginDto } from './auth.dto';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@Inject(DbProvider) private readonly db: DbClient,
		private readonly jwtService: JwtService
	) { }

	generateToken(payload: any) {
		return this.jwtService.signAsync(payload, {
			secret: process.env.JWT_SECRET
		})
	}

	userExistsByEmail(email: string) {
		const query = this.db.select()
			.from(userTable)
			.where(eq(userTable.email, email))

		console.log(query.toSQL().sql)
		return query.execute()
	}

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

	async verifyUserAndCreateToken(data: LoginDto) {
		const user = await this.userExistsByEmail(data.email)

		if (!user) {
			throw new UnauthorizedException('User does not exist.')
		}

		if (!await verify(user[0].password, data.password)) {
			throw new UnauthorizedException('Wrong password')
		}

		return {
			accessToken: await this.generateToken({
				id: user[0].id,
				name: user[0].name
			})
		}
	}

}


