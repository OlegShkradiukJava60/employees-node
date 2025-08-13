import { faker } from "@faker-js/faker";
import { Employee } from "../model/dto-types/Employee.ts";
import {
  getDepartments,
  getMaxAge,
  getMaxSalary,
  getMinAge,
  getMinSalary,
} from "./config_functions.ts";
const N_RANDOM_EMPLOYEES = 20;
export function getId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
export function getRandomEmployees() {
  const employees: Employee[] = Array.from(
    { length: N_RANDOM_EMPLOYEES },
    getRandomEmployee
  );
  return employees;
}
export function getRandomEmployee(): Employee {
  const res: Employee = {} as Employee;
  const gender = faker.helpers.arrayElement(["female", "male"]);
  res.id = getId();
  res.department = faker.helpers.arrayElement(getDepartments());
  res.fullName = faker.person.fullName({ sex: gender });
  res.avatar = getAvatar(gender);
  res.salary = faker.number.int({
    min: getMinSalary(),
    max: getMaxSalary(),
    multipleOf: 100,
  });
  res.birthDate = faker.date
    .birthdate({ min: getMinAge(), max: getMaxAge(), mode: "age" })
    .toISOString()
    .substring(0, 10);
  return res;
}
export function getAvatar(gender) {
  let res = faker.image.avatar();
  res =
    gender == "male"
      ? res.replace("female", "male")
      : res.replace("/male", "/female");
  return res;
}
