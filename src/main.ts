import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  // console.log(
  //   'POSTGRES_DATABASE_URL =',
  //   configService.get('POSTGRES_DATABASE_URL'),
  // );
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('TeamChallengeChatApi')
    .setDescription('API for TeamChallengeChat  ')
    .setVersion('1.0')
    .addBearerAuth() // JWT auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_PATH || 'api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
