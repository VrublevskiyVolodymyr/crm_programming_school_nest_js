import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { LoggerService } from '../../modules/logger/logger.service';
import { DbQueryFailedFilter } from './db-query-failed.filter';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let messages: string[];
    let errorType: string;

    if (exception instanceof BadRequestException) {
      const extractedMessages = this.extractMessages(exception);

      if (
        extractedMessages.some((msg) => msg.includes('Wrong email or password'))
      ) {
        status = 401;
        messages = ["Field 'Wrong': Wrong email or password"];
        errorType = 'UnauthorizedException';
      } else {
        status = exception.getStatus();
        const responseData = exception.getResponse();

        if (
          typeof responseData === 'object' &&
          responseData !== null &&
          'message' in responseData &&
          Array.isArray(responseData.message)
        ) {
          messages = responseData.message.map((error: string) => {
            const fieldName = error.split(' ')[0]; // Отримуємо перше слово як поле
            return `Field '${fieldName}': ${error.replace(/regular expression/g, '')}`;
          });
        } else {
          messages = ['Validation failed'];
        }

        errorType = exception.name;
      }
    } else if (exception instanceof UnauthorizedException) {
      status = 401;
      messages = ["Field 'Wrong': Wrong email or password"];
      errorType = 'UnauthorizedException';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      messages = this.extractMessages(exception);
      errorType = exception.name;
    } else if (exception instanceof QueryFailedError) {
      const error = DbQueryFailedFilter.filter(exception);
      status = error.status;
      messages = [error.message];
      errorType = 'Database error';
    } else {
      status = 500;
      messages = ['Internal server error'];
      errorType = 'Internal error';
    }

    response.status(status).json({
      error: errorType,
      code: status,
      details: messages,
    });
  }

  private extractMessages(exception: HttpException): string[] {
    const responseData = exception.getResponse();
    if (
      typeof responseData === 'object' &&
      responseData !== null &&
      'message' in responseData
    ) {
      if (Array.isArray(responseData.message)) {
        return responseData.message.map((msg) => msg.toString());
      }
      return [responseData.message.toString()];
    }
    return ['Unknown error'];
  }
}
