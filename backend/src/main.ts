import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for Next.js frontend
  app.useGlobalPipes(new ValidationPipe()); // Enable validation
  await app.listen(3001); // Listen on port 3001 (NestJS default is 3000, but Next.js also uses it)
  console.log(`Backend is running on: http://localhost:3001`);
}
bootstrap();
