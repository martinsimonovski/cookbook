import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

declare const module: unknown;

const authClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: '*:50052',
    package: 'email',
    protoPath: join(__dirname, '../../packages/proto-files/email.proto'),
  },
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(authClientOptions);

  app.startAllMicroservices();

  app.use(helmet());
  app.use(
    new rateLimit({
      windowMs: 0.5 * 60 * 1000, // 30 sec
      max: 100 // limit each IP to 300 requests per windowMs
    })
  );

  const options = new DocumentBuilder()
    .setTitle('Cookbook')
    .setDescription('A CRQS api gateway with microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
