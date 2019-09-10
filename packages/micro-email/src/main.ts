import { NestFactory } from '@nestjs/core';
import { Transport, GrpcOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: '*:50052',
    package: 'email',
    protoPath: join(__dirname, '../../../packages/proto-files/email.proto'),
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, grpcClientOptions);

  await app.listen(() => {
    console.log(`Microservice Users is listening on ${grpcClientOptions.options.url}...`)
  });
}
bootstrap();
