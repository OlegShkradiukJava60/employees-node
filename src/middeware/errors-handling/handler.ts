import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import {
  EmployeeAlreadyExistsError,
  EmployeeNotFoundError,
} from "../../service/EmployeesServiceMap.ts";
import { getZodMessage } from "./zod-errors-message.ts";

export const errorsHandler = (
  error: any,
  __: Request,
  res: Response,
  ___: NextFunction
) => {
  let status = 500;
  let message = "internal error";

  if (typeof error?.status === "number") {
    status = error.status;
    message = typeof error?.message === "string" ? error.message : message;
  }
  else if (error instanceof EmployeeAlreadyExistsError) {
    status = 409;
    message = error.message;
  } else if (error instanceof EmployeeNotFoundError) {
    status = 404;
    message = error.message;
  }
  else if (error instanceof ZodError) {
    status = 400;
    message = getZodMessage(error);
  }
  else if (error instanceof Error && error.message === "Wrong credentials") {
    status = 401;
    message = error.message;
  }

  else if (error instanceof Error) {
    message = error.message || message;
  }

  if (status === 500) {
    console.error(error);
  }

  res.status(status).send(message);
};
