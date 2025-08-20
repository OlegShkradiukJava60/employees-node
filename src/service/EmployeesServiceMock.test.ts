import { Employee } from "../model/dto-types/Employee.ts";
import EmployeesService from "./EmployeesService.ts";
import { registerEmployeesService } from "./registry.ts";
export default class EmployeesServiceMock implements EmployeesService {
    async addEmployee(empl: Employee): Promise<Employee> {
        return {} as Employee
    }
    async getAll(department?: string): Promise<Employee[]> {
        return [];
    }
    async updateEmployee(id: string, empl: Partial<Employee>): Promise<Employee> {
         return {} as Employee
    }
    async deleteEmployee(id: string): Promise<Employee> {
        return {} as Employee
    }
    async save(): Promise<void> {
       
    }
    
}
registerEmployeesService("mock", async (_) => new EmployeesServiceMock())