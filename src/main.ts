import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'https://your-frontend.com',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const configService = app.get(ConfigService);

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('TeamChallengeChatApi')
    .setDescription('API for TeamChallengeChat  ')
    .setVersion('1.0')
    .addBearerAuth() // JWT auth
    .build();

  app.use(cookieParser());

  // env
  const env = configService.get('NODE_ENV', 'development');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    configService.get('SWAGGER_PATH') || 'api',
    app,
    document,
  );

  await app.listen(configService.get('PORT') ?? 3000);

  console.log(`Environment: ${env}`);
  console.log('MONGO_DATABASE_URL =', configService.get('MONGO_DATABASE_URL'));
  console.log(
    'POSTGRES_DATABASE_URL =',
    configService.get('POSTGRES_DATABASE_URL'),
  );
  console.log(
    'API on http://localhost:' +
      configService.get('PORT') +
      configService.get('SWAGGER_PATH'),
  );
}
bootstrap();
