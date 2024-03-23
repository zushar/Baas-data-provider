import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import HttpExceptionFilter from './http-exception-filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  it('should catch HttpException and return response with status code and timestamp', () => {
    const status = 404;
    const exception = new HttpException('Not Found', status);
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const request = {} as Request;
    const host = {
      switchToHttp: jest.fn().mockReturnThis(),
      getResponse: jest.fn().mockReturnValue(response),
      getRequest: jest.fn().mockReturnValue(request),
    };

    filter.catch(exception, host as unknown as ArgumentsHost);

    // WE IGNORE TIMESTAMP IN RESPONSE.JSON AS MOCKING IT IS A PAIN IN THE ASS
    expect(host.getResponse).toHaveBeenCalled();
    expect(host.getRequest).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(status);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: status,
        path: undefined,
      }),
    );
  });
});
