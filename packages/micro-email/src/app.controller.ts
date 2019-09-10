import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import * as grpc from 'grpc';

export interface Email {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @GrpcMethod('EmailService', 'Send')
  async send(data: Email, metadata: grpc.Metadata) {
    let sent = await this.appService.sendEmail(data).then(res => res);
    console.warn({ sent })
    // const user = await this.authService.createNewUser(data).then(res => res);
    // await this.authService.createEmailToken(user.email);
    // await this.authService.saveUserConsent(user.email);
    // let sent = await this.authService.sendEmailVerification(user.email).then(res => {
    //   console.warn({ res })
    // });

    // if (true) {
    //   return grpcResponse(user);
    // } else {
    //   throw new GrpcInternalError('Email problem');
    // }


  }
}
