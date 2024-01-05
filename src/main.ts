import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api')
	app.useGlobalPipes(new ValidationPipe())

	await app.listen(process.env.PORT, () => {
		console.log(`Server listening on port: ${process.env.PORT}`)
		console.log(process.env.NODE_ENV)
	});
}
bootstrap();
