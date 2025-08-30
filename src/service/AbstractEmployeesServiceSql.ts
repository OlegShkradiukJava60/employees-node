import { Employee } from "../model/dto-types/Employee.ts";
import {
  EmployeeAlreadyExistsError,
  EmployeeNotFoundError,
} from "../model/error-types/employee-error.ts";
import { getId } from "../utils/service-helpers.ts";
import EmployeesService from "./EmployeesService.ts";
import knex, { Knex } from "knex";
const TABLE_NAME = "employees";
export default abstract class AbstractEmployeesServiceSql
  implements EmployeesService
{
  private db: Knex;
  constructor(config: Knex.Config) {
    this.db = knex(config);
  }
  async createTable(): Promise<void> {
    const exists = await this.db.schema.hasTable(TABLE_NAME);
    if (!exists) {
      await this.db.schema.createTable(TABLE_NAME, (table) => {
        table.string("id").primary();
        table.string("fullName");
        table.string("avatar").defaultTo("");
        table.string("department");
        table.string("birthDate");
        table.integer("salary");
        table.index(["department"]) //creating index for better performence of queries by department
      });
    }
  }
  async addEmployee(empl: Employee): Promise<Employee> {
    if (!empl.id) {
      empl.id = getId();
    }
    try {
      await this.db<Employee>(TABLE_NAME).insert(empl);
    } catch (error) {
      throw new EmployeeAlreadyExistsError(empl.id);
    }
    return empl;
  }

  async getAll(department?: string): Promise<Employee[]> {
    const query = this.db(TABLE_NAME);
    if (department) {
      query.where({ department });
    }
    return await query;
  }
  async updateEmployee(id: string, empl: Partial<Employee>): Promise<Employee> {
    const res = await this.db(TABLE_NAME).where({ id }).update(empl);
    if (res == 0) {
      throw new EmployeeNotFoundError(id);
    }
    return this.getEmployee(id);
  }
  async deleteEmployee(id: string): Promise<Employee> {
    const empl = await this.getEmployee(id);
    await this.db<Employee>(TABLE_NAME).where({ id }).delete();
    return empl;
  }
  async getEmployee(id: string): Promise<Employee> {
    const empl = await this.db<Employee>(TABLE_NAME).where({ id }).first();
    if (!empl) {
      throw new EmployeeNotFoundError(id);
    }
    return empl;
  }
  async save(): Promise<void> {
    await this.db.destroy();
  }
}
