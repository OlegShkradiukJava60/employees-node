import service from "./bootstrap.ts";
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Employee } from "../model/dto-types/Employee.ts";
import { EmployeeAlreadyExistsError, EmployeeNotFoundError } from "../model/error-types/employee-error.ts";
const stateEmployees: Employee[] = [
  {
    id: "123",
    avatar: "",
    salary: 10000,
    birthDate: "2000-01-01",
    department: "QA",
    fullName: "Full Name",
  },
  {
    id: "321",
    avatar: "",
    salary: 10000,
    birthDate: "2000-01-01",
    department: "QA",
    fullName: "Full Name",
  },
  {
    id: "124",
    avatar: "",
    salary: 10000,
    birthDate: "2000-01-01",
    department: "Development",
    fullName: "Full Name",
  },
  {
    id: "125",
    avatar: "",
    salary: 10000,
    birthDate: "2000-01-01",
    department: "Development",
    fullName: "Full Name",
  },
];
beforeEach(async () => {
  const array: Employee[] = await service.getAll();
  for (let empl of array) {
    await service.deleteEmployee(empl.id);
  }
  for (let empl of stateEmployees) {
    await service.addEmployee(empl)
  }
});
test("add existing employee -> throwing EmployeeAlreadyExistsError", async() => {
    await assert.rejects(service.addEmployee(stateEmployees[0]), EmployeeAlreadyExistsError)
})
test("delete existing employee", async () => {
    const res = await service.deleteEmployee("123");
    assert.equal(res.id, "123")
})
test("add existing employee -> throwing EmployeeAlreadyExistsError", async() => {
    await assert.rejects(service.addEmployee(stateEmployees[0]), EmployeeAlreadyExistsError)
})
test ("delete non existing employee -> throwing EmployeeNotFoundError", async () => {
    await assert.rejects(service.deleteEmployee("kuku"), EmployeeNotFoundError)
})

