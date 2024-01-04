import { Module } from '@nestjs/common';
import postgres from 'postgres';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import * as userSchema from '../../drizzle/schema/user'
import * as noteSchema from '../../drizzle/schema/note'

export const DbProvider = 'DbProvider'

const schema = {
	...userSchema,
	...noteSchema
}

export type DbClient = PostgresJsDatabase<typeof schema>

@Module({
	providers: [
		{
			provide: DbProvider,
			useFactory: async () => {
				const queryClient = postgres(process.env.DATABASE_URL);
				return drizzle(queryClient, {
					schema
				})
			}
		}
	],
	exports: [DbProvider]

})
export class DbModule {}
