import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { GrpcInternalError } from '@cookbook/common/dist/src/utils/GrpcErrors';
import { InjectModel } from '@nestjs/mongoose';
import * as cron from 'node-cron';
import { Email } from './app.controller';

interface EmailModel {
  _id: string;
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
}


@Injectable()
export class AppService {
  private transporter;

  constructor(@InjectModel('Email') private readonly emailModel: Model<EmailModel>) {
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

  public sendEmail(data: Email): Promise<boolean> {
    const email = new Email(data);
    return new Promise<boolean>(async (resolve, reject) => {
      return this.transporter.sendMail(email, (error, info) => {
        if (error) {
          console.log({ error })
          reject(false);
        }
        return resolve(true);
      });
    });
  }

  async write(email: Email): Promise<boolean> {
    const createdEmail = new this.emailModel({
      ...email,
      sent: false
    });

    try {
      await createdEmail.save();
      return true;
    } catch (e) {
      throw new GrpcInternalError('There was an error while sending confirmation email', e);
    }
  }

  runJob() {
    let interval = 15000;
    this.emailModel.find({ sent: false }).limit(10).exec((err, emails) => {
      // sent emails
      emails.forEach((email, i) => {
        setTimeout(() => {
          this.sendEmail(email).then(response => {
            if (response) {
              this.emailModel.findByIdAndDelete(email._id, null, (err, res) => {
                console.log('.');
                if (err) {
                  console.log('Delete email error', { err })
                }
              });
            }
          }, error => {
            console.log('==> there was an error', error)
          });
        }, i * interval);
      });
    });
  }

  runEmailScheduler() {
    cron.schedule('* * * * *', () => {
      console.log('Sending emails...');
      this.runJob();
    });
  }
}
