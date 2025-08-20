export class EmployeeAlreadyExistsError extends Error {
  constructor(id: string) {
    super(`employee with id ${id} already exists`);
    Object.setPrototypeOf(this, EmployeeAlreadyExistsError.prototype);
  }
}
export class EmployeeNotFoundError extends Error {
  constructor(id: string) {
    super(`employee with id ${id} not found`);
    Object.setPrototypeOf(this, EmployeeNotFoundError.prototype);
  }
}
export class LoginError extends Error {
  constructor() {
    super("Wrong Credentials");
    Object.setPrototypeOf(this, LoginError.prototype);
  }
}