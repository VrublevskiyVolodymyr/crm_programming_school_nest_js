import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SwaggerHelper } from './common/helpers/swagger.helper';
import { AppConfig } from './config/config.types';
import { AppModule } from './modules/app.module';
import { SeederAdminService } from './modules/auth/services/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  const seeder = app.get(SeederAdminService);
  await seeder.seedAdmin();

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('CRM Programming School')
    .setDescription(
      `[ Base URL: http://${appConfig.host}:${appConfig.port}/api/v1 ]`,
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .addTag(
      'CRM Programming School',
      'A robust backend to streamline application management and enhance efficiency.',
    )
    .setTermsOfService('https://policies.google.com/terms')
    .setContact('Developer', '', 'v637904@gmaol.com')
    .setLicense('BSD License', 'http://opensource.org/licenses/BSD-3-Clause')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.paths = Object.keys(document.paths).reduce((acc, path) => {
    const modifiedPath = path.startsWith('/api/v1')
      ? path.replace('/api/v1', '')
      : path;
    acc[modifiedPath] = document.paths[path];
    return acc;
  }, {});
  document.servers = [
    {
      url: `http://${appConfig.host}:${appConfig.port}/api/v1`,
    },
  ];
  SwaggerHelper.setDefaultResponses(document);
  SwaggerModule.setup(`api/v1/docs`, app, document, {
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
    Logger.log(
      `Server running on http://${appConfig.host}:${appConfig.port}/api/v1`,
    );
    Logger.log(
      `Swagger running on http://${appConfig.host}:${appConfig.port}/api/v1/docs`,
    );
  });
}
void bootstrap();
