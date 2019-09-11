import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSchema } from './schemas/email.schema'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    MongooseModule.forFeature([{ name: 'Email', schema: EmailSchema }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
