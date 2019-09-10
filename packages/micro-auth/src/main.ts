import { NestFactory } from '@nestjs/core';
import { Transport, GrpcOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AuthModule } from './auth.module';
import { ValidationPipe } from './lib/pipes/validation.pipe';

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
    console.log(`Microservice Users is listening on ${grpcClientOptions.options.url}...`)
  })
}
bootstrap();