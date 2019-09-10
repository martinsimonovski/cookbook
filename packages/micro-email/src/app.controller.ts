import { Controller, Get, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import * as grpc from 'grpc';
import { grpcResponse } from '@cookbook/common/dist/src/responses/formatGrpsResponse';
import { GrpcInternalError } from '@cookbook/common/dist/src/utils/GrpcErrors';
import { ExceptionFilter } from '@cookbook/common/dist/src/filters/grpcException.filter';
import { AppService } from './app.service';

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

  @UseFilters(new ExceptionFilter())
  @GrpcMethod('EmailService', 'Send')
  async send(data: Email, metadata: grpc.Metadata) {
    let sent = await this.appService.sendEmail(data).then(res => res);

    if (sent) {
      return grpcResponse(sent);
    } else {
      throw new GrpcInternalError('Email problem');
    }
  }
}
