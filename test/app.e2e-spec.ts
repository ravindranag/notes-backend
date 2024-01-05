import { drizzle } from 'drizzle-orm/postgres-js';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { userTable } from '../drizzle/schema/user';
import { noteTable } from '../drizzle/schema/note';


describe('AppController (e2e)', () => {
	let app: INestApplication;
	let sql: postgres.Sql;
	let token: string;
	let noteId: string;
	let user2Id: string;

	const user = {
		name: 'Ravindra Nag',
		email: 'ravindranag52@gmail.com',
		password: 'pass1234!'
	}

	const user2 = {
		name: 'Test User',
		email: 'test@gmail.com',
		password: 'pass1234!'
	}

	const note = {
		title: 'New note',
		content: 'Remember to buy milk'
	}

	beforeAll(async () => {
		sql = postgres(process.env.DATABASE_URL, {
			max: 1
		})
		const db = drizzle(sql)
		await migrate(db, {
			migrationsFolder: 'drizzle/migrations'
		})

		await db.delete(userTable)
		await db.delete(noteTable)
	})


	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await sql.end()
		await app.close()
	})

	it('/ (GET)', () => {
		return request(app.getHttpServer())
			.get('/')
			.expect(200)
			.expect('Hello World!');
	});

	it('/api/auth/signup (POST) Create user', async () => {
		const res = await request(app.getHttpServer())
			.post('/auth/signup')
			.send(user)
			.expect(201);
		expect(res.body).toBeDefined();
	})

	it('/api/auth/signup (POST) Create 2nd user', async () => {
		const res = await request(app.getHttpServer())
			.post('/auth/signup')
			.send(user2)
			.expect(201);
		expect(res.body).toBeDefined();
	})

	it('/api/auth/login (POST) Login', async () => {
		const res = await request(app.getHttpServer())
			.post('/auth/login')
			.send(user)
			.expect(201);

		token = res.body.accessToken
		expect(res.body.accessToken).toBeDefined()
	})

	it('/api/notes/ (POST) Create a note', async () => {
		const res = await request(app.getHttpServer())
			.post('/notes')
			.send(note)
			.set('Authorization', `Bearer ${token}`)
			.expect(201);
		expect(res.body.note.id).toBeDefined()
		noteId = res.body.note.id
	})

	it('/api/notes/ (PUT) Update note', async () => {
		const res = await request(app.getHttpServer())
			.put(`/notes/${noteId}`)
			.send({
				...note,
				content: 'Updated content'
			})
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
		expect(res.body.content).toBe('Updated content')
	})

	it('/api/user/search (GET) Search for users', async () => {
		const res = await request(app.getHttpServer())
			.get(`/user/search/?q=test`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(res.body).toBeInstanceOf(Array)
		user2Id = res.body[0].id
	})

	it('/api/notes/:noteId/share (POST) Share note with 2nd user', async () => {
		const res = await request(app.getHttpServer())
			.post(`/notes/${noteId}/share`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				userList: [
					user2Id
				]
			})
			.expect(201);
		
		expect(res.body.message).toBe('Note shared with user successfully.')
	})

	it('/api/notes/:noteId (DELETE) Delete note', () => {
		return request(app.getHttpServer())
			.delete(`/notes/${noteId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
	})

});
