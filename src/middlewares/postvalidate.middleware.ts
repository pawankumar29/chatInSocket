import * as express from "express";
import { validationResult } from 'express-validator';

import RESPONSES from "../constant/response"
/**
 * Throw error if failed to validate
 * @param req 
 * @param res 
 * @param next 
 */
const postValidate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const error:any = validationResult(req);
  const responseError: Array<object> = [];

  if (!error.isEmpty()) {
    for (const errorRow  of error.array()) {
      responseError.push({ field: errorRow.path, message: errorRow.msg })
    }
    return res.status(RESPONSES.BADREQUEST).send(
      {
        response: {
          status: 400,
          message: "Error!",
          error: true,
          data: responseError
        }
      });

  } else {
    next();
  }
};

export default postValidate;
