import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import {
  EmployeeAlreadyExistsError,
  EmployeeNotFoundError,
} from "../../service/EmployeesServiceMap.ts";
import { getZodMessage } from "./zod-errors-message.ts";
export const errorsHandler = (
  error: Error,
  __: Request,
  res: Response,
  ___: NextFunction
) => {
  let status = 400;
  if (error instanceof EmployeeAlreadyExistsError) {
    status = 409;
  } else if (error instanceof EmployeeNotFoundError) {
    status = 404;
  }
  const message =
    error instanceof ZodError ? getZodMessage(error) : error.message;
  res.statusCode = status;
  res.send(message);
};
