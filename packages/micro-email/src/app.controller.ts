import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as grpc from 'grpc';
import { grpcResponse, GrpcInternalError, ExceptionFilter } from '@cookbook/common';
import { AppService } from './app.service';

export interface Email {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html: string;
}

export class Email implements Email {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  html: string;

  constructor(data: Email) {
    this.from = data.from;
    this.to = data.to;
    this.subject = data.subject;
    this.text = data.text;
    this.html = data.html;
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @UseFilters(new ExceptionFilter())
  @GrpcMethod('EmailService', 'Send')
  async send(data: Email, metadata: grpc.Metadata) {
    let sent = await this.appService.write(data).then(res => res);

    if (sent) {
      return grpcResponse(sent);
    } else {
      throw new GrpcInternalError('Email problem');
    }
  }
}
