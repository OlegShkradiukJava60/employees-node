import { Employee } from "../model/Employee";
import EmployeesService from "./EmployeesService";
export class EmployeeAlreadyExistsError extends Error {
    constructor(id: string) {
        super(`employee with id ${id} already exists`);
        Object.setPrototypeOf(this, EmployeeAlreadyExistsError.prototype)
    }
}
export class EmployeeNotFoundError extends Error {
    constructor(id: string) {
        super(`employee with id ${id} not found`);
         Object.setPrototypeOf(this, EmployeeNotFoundError.prototype)
    }
}
 class EmployeesServiceMap implements EmployeesService {
     private _employees: Map<string, Employee> = new Map();
    addEmployee(empl: Employee): Employee {
        const id = empl.id ?? (empl.id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
        if (this._employees.has(id)) {
            throw new EmployeeAlreadyExistsError(id);
        }
        this._employees.set(id, empl);
        return empl;
    }
    getAll(department?: string): Employee[] {
        let res: Employee[] = Array.from(this._employees.values());
        if(department) {
            res = res.filter(empl => empl.department === department)
        }
        return res;
    }
    updateEmployee(id: string, empl: Partial<Employee>): Employee {
        const employee =  this.getEmployee(id);
        Object.assign(employee, empl);
        return employee;
    }
    deleteEmployee(id: string): Employee {
       const employee =  this.getEmployee(id);
       this._employees.delete(id);
       return employee;
    }
   

    private getEmployee(id: string): Employee {
        const employee = this._employees.get(id);
        if (!employee) {
            throw new EmployeeNotFoundError(id);
        }
        return employee;
    }
}
const service: EmployeesService = new EmployeesServiceMap();
export default service;