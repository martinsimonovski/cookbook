import {
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    Logger
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { GrpcCanceledError } from '../utils/GrpcErrors';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    private logger = new Logger('ValidationPipe');

    async transform(value, metadata: ArgumentMetadata) {
        this.logger.log(JSON.stringify({ value, metadata }), 'Transform: ');
        if (!value) {
            throw new GrpcCanceledError('Validation Error: No data submited');
        }

        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new GrpcCanceledError('Validation Error: Wrong data', this.buildError(errors));
        }

        return value;
    }

    private buildError(errors) {
        const result = {};
        errors.forEach(el => {
            const prop = el.property;
            result[prop] = {};
            Object.entries(el.constraints).forEach(constraint => {
                result[prop][constraint[0]] = `${constraint[1]}`;
            });
        });
        return result;
    }

    private toValidate(metatype): boolean {
        this.logger.log(JSON.stringify({ metatype }), 'toValidate: ');
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }
}