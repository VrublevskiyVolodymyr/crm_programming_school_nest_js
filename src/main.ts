import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SwaggerHelper } from './common/helpers/swagger.helper';
import { AppConfig } from './config/config.types';
import { AppModule } from './modules/app.module';
import { SeederService } from './modules/cars/services/seeder.service';
import { CurrencyService } from './modules/financial/services/currency.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const seeder = app.get(SeederService);
  const currency = app.get(CurrencyService);
  await seeder.seedData();
  await currency.updateCurrencyRates();

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  const config = new DocumentBuilder()
    .setTitle('crm_programming_school')
    .setDescription(
      'API for the CRM system of Programming School. It includes functionality for user authentication,\n' +
        'managing applications, filtering, creating managers, handling roles, and generating statistics.',
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerHelper.setDefaultResponses(document);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 7,
      persistAuthorization: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(appConfig.port, () => {
    Logger.log(`Server running on http://${appConfig.host}:${appConfig.port}`);
    Logger.log(
      `Swagger running on http://${appConfig.host}:${appConfig.port}/docs`,
    );
  });
}
void bootstrap();
