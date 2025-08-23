import { Employee } from "../model/dto-types/Employee.ts";
import EmployeesService from "./EmployeesService.ts";
import fs from "node:fs";
import path from "node:path";
import { getId } from "../utils/service-helpers.ts";
import { EmployeeAlreadyExistsError, EmployeeNotFoundError } from "../model/error-types/employee-error.ts";
import { registerEmployeesService } from "./registry.ts";
const DEFAULT_FILE_NAME = "employees.data";

class EmployeesServiceMap implements EmployeesService {
  private _employees: Map<string, Employee> = new Map();
  private _filePath: string;
  constructor(private _flUpdate = false) {
    this._filePath = path.resolve(
      process.cwd(),
      process.env.FILE_NAME || DEFAULT_FILE_NAME
    );

    if (fs.existsSync(this._filePath)) {
      const jsonEmployees = fs.readFileSync(this._filePath, {
        encoding: "utf8",
      });
      (JSON.parse(jsonEmployees) as Array<Employee>).forEach((empl) =>
        this.addEmployee(empl)
      );
    }
  }

  async addEmployee(empl: Employee): Promise<Employee> {
    const id = empl.id ?? (empl.id = getId());
    if (this._employees.has(id)) {
      throw new EmployeeAlreadyExistsError(id);
    }
    this._employees.set(id, empl);
    this._flUpdate = true;
    return empl;
  }

  async getAll(department?: string): Promise<Employee[]> {
    let res: Employee[] = Array.from(this._employees.values());
    if (department) {
      res = res.filter((empl) => empl.department === department);
    }
    return res;
  }
  async updateEmployee(id: string, empl: Partial<Employee>): Promise<Employee> {
    const employee = await this.getEmployee(id);
    Object.assign(employee, empl);
    this._flUpdate = true;
    return employee;
  }
  async deleteEmployee(id: string): Promise<Employee> {
    const employee = await this.getEmployee(id);
    this._employees.delete(id);
    this._flUpdate = true;
    return employee;
  }

  async  getEmployee(id: string): Promise<Employee> {
    const employee = this._employees.get(id);
    if (!employee) {
      throw new EmployeeNotFoundError(id);
    }
    return employee;
  }
  async save(): Promise<void> {
    const jsonEmployees = JSON.stringify(await this.getAll());
    if (this._flUpdate) {
      //saving only if updated
      fs.writeFileSync(this._filePath, jsonEmployees, { encoding: "utf8" });
      this._flUpdate = false;
    }
  }
}
registerEmployeesService("map", async (_) => new EmployeesServiceMap())
