import { NestFactory } from '@nestjs/core';
import { Transport, GrpcOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ValidationPipe } from '@cookbook/common';
import { AuthModule } from './auth.module';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: '*:50051',
    package: 'auth',
    protoPath: join(__dirname, '../../../packages/proto-files/auth.proto'),
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, grpcClientOptions);

  app.useGlobalPipes(new ValidationPipe());

  app.listen(() => {
    console.log(`Micro-auth: ${grpcClientOptions.options.url}...`)
  })
}
bootstrap();