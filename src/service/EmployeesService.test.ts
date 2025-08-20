import service from "./bootstrap.ts";
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Employee } from "../model/dto-types/Employee.ts";
import { EmployeeAlreadyExistsError, EmployeeNotFoundError } from "../model/error-types/employee-error.ts";
import _ from "lodash"
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
    id: "124",
    avatar: "",
    salary: 10000,
    birthDate: "2000-01-01",
    department: "QA",
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
  {
    id: "126",
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
test("add new employee object with no id -> returns added object with id", async () => {
    const result = await service.addEmployee({avatar: "",
    salary: 10000,
    birthDate: "2000-01-01",
    department: "QA",
    fullName: "Full Name"});
    assert.ok(result.id);
})
test("delete existing employee", async () => {
    const res = await service.deleteEmployee("123");
    assert.equal(res.id, "123");
    const resAdd = await service.addEmployee(stateEmployees[0]);
    assert.deepEqual(res, resAdd)
})

test ("delete non existing employee -> throwing EmployeeNotFoundError", async () => {
    await assert.rejects(service.deleteEmployee("kuku"), EmployeeNotFoundError)
})
test ("update non existing employee -> EmployeeNotFoundError", async () => {
    await assert.rejects(service.updateEmployee("kuku", {salary: 30000}), EmployeeNotFoundError)
})
test ("update existing employee -> returns employee with updated salary value", async () => {
    const res = await service.updateEmployee("123", {salary:30000});
    assert.deepEqual(res, {...stateEmployees[0], salary: 30000})
})
test ("getting all employee objects for all departments -> array of state employees is returned", async () => {
    const res = await service.getAll();
    assert.deepEqual(_.orderBy(res, "id"), stateEmployees)
})
test("getting all employees by a department -> array of state employees having the given department", async () => {
    let res = await service.getAll("QA");
    assert.deepEqual(_.orderBy(res, "id"), stateEmployees.slice(0, 2))
    res = await service.getAll("Development");
    assert.deepEqual(_.orderBy(res, "id"), stateEmployees.slice(2))
    res = await service.getAll("kuku");
    assert.ok(_.isArray(res) && _.isEmpty(res))
})
test ("getting non existing employee by ID -> EmployeeNotFoundError", async () => {
   await assert.rejects(service.getEmployee("kuku"), EmployeeNotFoundError)
})
test ("getting existing employee -> returns employee", async () => {
    const res = await service.getEmployee("123");
    assert.deepEqual(res, stateEmployees[0])
})



