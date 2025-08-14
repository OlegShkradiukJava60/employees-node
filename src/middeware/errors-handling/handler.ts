import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import {
  EmployeeAlreadyExistsError,
  EmployeeNotFoundError,
} from "../../model/error-types/employee-error.ts";
import { getZodMessage } from "./zod-errors-message.ts";
import { AuthenticationError, AuthorizationError } from "../../model/error-types/aaa-errors.ts";
const errorStatus = new Map<Function, number>(
  [
    [EmployeeAlreadyExistsError, 409],
    [EmployeeNotFoundError, 404],
    [AuthenticationError, 401],
    [AuthorizationError, 403]
  ]
)
export const errorsHandler = (
  error: Error,
  __: Request,
  res: Response,
  ___: NextFunction
) => {
  const {status, message} = getStatusMessage(error);
    
  res.statusCode = status;
  res.send(message);
};
function getStatusMessage(error: Error): { status: number; message: string; } {
  let status: number = 500;
  let message: string = error.message;
  if (error instanceof ZodError) {
    status = 400;
    message = getZodMessage(error)
  } else {
    status = errorStatus.get((error as any).constructor) ?? 500
  }
  return {status, message};
}

