import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { GrpcOptions } from '@nestjs/common/interfaces/microservices/microservice-configuration.interface';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

const logger = new Logger('Main');

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: '*:50051',
    package: 'auth',
    protoPath: join(__dirname, '../src/proto/auth.proto'),
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, grpcClientOptions);

  app.useGlobalPipes(new ValidationPipe());

  app.listen(() => {
    logger.log('Main.ts', join(__dirname, './user.proto'));
    console.log(`Microservice Users is listening on ${grpcClientOptions.options.url}...`)
  })
}
bootstrap();