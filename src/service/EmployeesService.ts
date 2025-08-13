import { Employee } from "../model/dto-types/Employee.ts";

export default interface EmployeesService {
  addEmployee(empl: Employee): Employee;
  getAll(department?: string): Employee[];
  updateEmployee(id: string, empl: Partial<Employee>): Employee;
  deleteEmployee(id: string): Employee;
  save(): void;
}
