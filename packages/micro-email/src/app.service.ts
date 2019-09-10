import { Injectable } from '@nestjs/common';
import { Email } from './app.controller';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

@Injectable()
export class AppService {
  private transporter;

  constructor() {
    let config = dotenv.config();
    config = config.parsed;

    this.transporter = nodemailer.createTransport(
      {
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        auth: {
          user: config.SMTP_USERNAME,
          pass: config.SMTP_PASSWORD
        }
      }
    )
  }

  public async sendEmail(email: Email): Promise<boolean> {
    try {
      let sent = await new Promise<boolean>(async (resolve, reject) => {
        return await this.transporter.sendMail(email, async (error, info) => {
          if (error) {
            console.warn('ERRRORRRR', JSON.stringify(error));
            // throw new GrpcInternalError('There was an error while sending confirmation email');
          }
          return resolve(true);
        });
      })
      return sent;
    } catch (e) {
      console.warn('Catch ERRRORRRR', JSON.stringify(e));
      // throw new GrpcInternalError('There was an error while sending confirmation email');
    }
  }
}
