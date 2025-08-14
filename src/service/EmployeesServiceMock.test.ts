import { Employee } from "../model/dto-types/Employee";
import EmployeesService from "./EmployeesService";
export default class EmployeesServiceMock implements EmployeesService {
    addEmployee(empl: Employee): Employee {
        return {} as Employee
    }
    getAll(department?: string): Employee[] {
        return [];
    }
    updateEmployee(id: string, empl: Partial<Employee>): Employee {
         return {} as Employee
    }
    deleteEmployee(id: string): Employee {
        return {} as Employee
    }
    save(): void {
       
    }
    
}