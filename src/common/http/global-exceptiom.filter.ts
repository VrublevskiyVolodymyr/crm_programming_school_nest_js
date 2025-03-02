import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
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
    let messages: string[] | string;
    let errorType: string;

    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();

      if (
        typeof responseData === 'object' &&
        responseData !== null &&
        'message' in responseData &&
        Array.isArray(responseData.message)
      ) {
        messages = responseData.message.map((error: string) => {
          const fieldName = error.split(' ').slice(0, 1);
          return `Field '${fieldName}': ${error.replace(/regular expression/g, '')}`;
        });
      } else {
        messages = ['Validation failed'];
      }

      errorType = 'Validation error';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();

      if (typeof responseData === 'object' && responseData !== null) {
        if ('message' in responseData) {
          messages = Array.isArray(responseData.message)
            ? responseData.message
            : [responseData.message];
        } else {
          messages = ['Unknown error'];
        }
      } else {
        messages = ['Unknown error'];
      }

      errorType = exception.name;
    } else if (exception instanceof QueryFailedError) {
      const error = DbQueryFailedFilter.filter(exception);
      status = error.status;
      messages = error.message;
      errorType = 'Database error';
    } else {
      status = 500;
      messages = 'Internal server error';
      errorType = 'Internal error';
    }

    messages = Array.isArray(messages) ? messages : [messages];

    response.status(status).json({
      error: errorType,
      code: status,
      details: messages,
    });
  }
}
