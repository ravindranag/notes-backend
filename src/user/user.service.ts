import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { userTable } from 'drizzle/schema/user';
import { DbClient, DbProvider } from 'src/db/db.module';

@Injectable()
export class UserService {
	constructor(
		@Inject(DbProvider) private readonly db: DbClient
	) {}

	userByEmail(email: string) {
		return this.db.select().from(userTable).where(eq(userTable.email, email)).limit(1)
	}

	userById(id: string) {
		return this.db.select({
			id: userTable.id,
			name: userTable.name,
			email: userTable.email
		}).from(userTable).where(eq(userTable.id, id)).limit(1)
	}
}
