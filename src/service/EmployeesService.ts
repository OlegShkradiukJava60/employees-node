import { Employee } from "../model/dto-types/Employee.ts";

export default interface EmployeesService {
  addEmployee(empl: Employee): Promise<Employee>;
  getAll(department?: string): Promise<Employee[]>;
  updateEmployee(id: string, empl: Partial<Employee>): Promise<Employee>;
  deleteEmployee(id: string): Promise<Employee>;
  getEmployee(id: string): Promise<Employee>
  save(): Promise<void>;
}
