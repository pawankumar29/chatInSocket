
import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/httpExceptions';

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
 console.log("errorMiddleware==>")
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  return res.status(status).send({
    message,
    status,
  });
}

export default errorMiddleware;

