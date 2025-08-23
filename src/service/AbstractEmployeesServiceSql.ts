import { Employee } from "../model/dto-types/Employee.ts";
import EmployeesService from "./EmployeesService.ts";
import knex, { Knex } from "knex";
import { getId } from "../utils/service-helpers.ts";
import { EmployeeAlreadyExistsError, EmployeeNotFoundError, } from "../model/error-types/employee-error.ts";

const TABLE_NAME = "employees";

export default abstract class AbstractEmployeesServiceSql
    implements EmployeesService {
    private db: Knex;

    constructor(config: Knex.Config) {
        this.db = knex(config);
    }

    async createTable() {
        const exists = await this.db.schema.hasTable(TABLE_NAME);
        if (!exists) {
            await this.db.schema.createTable(TABLE_NAME, (table) => {
                table.string("id").primary();
                table.string("fullName");
                table.string("avatar").defaultTo("");
                table.string("birthDate");
                table.integer("salary");
                table.string("department");
            });
        }
    }

    async addEmployee(empl: Employee): Promise<Employee> {
        const id = empl.id ?? (empl.id = getId());

        const exists = await this.db<Employee>(TABLE_NAME).where({ id }).first();
        if (exists) {
            throw new EmployeeAlreadyExistsError(id);
        }
        await this.db(TABLE_NAME).insert({
            id,
            fullName: empl.fullName,
            avatar: empl.avatar ?? "",
            birthDate: empl.birthDate,
            salary: empl.salary,
            department: empl.department,
        });
        return this.getEmployee(id);
    }
    async getAll(department?: string): Promise<Employee[]> {
        const query = this.db<Employee>(TABLE_NAME);
        if (department) {
            query.where({ department });
        }
        return await query;
    }

    async updateEmployee(id: string, patch: Partial<Employee>): Promise<Employee> {
        const current = await this.getEmployee(id);
        const updated: Employee = {
            ...current,
            ...patch,
            id: current.id,
            avatar: (patch.avatar ?? current.avatar) ?? "",
        };
        const changes = await this.db(TABLE_NAME).where({ id }).update({
            fullName: updated.fullName,
            avatar: updated.avatar ?? "",
            birthDate: updated.birthDate,
            salary: updated.salary,
            department: updated.department,
        });
        if (!changes) {
            throw new EmployeeNotFoundError(id);
        }
        return this.getEmployee(id);
    }

    async deleteEmployee(id: string): Promise<Employee> {
        const existing = await this.getEmployee(id);
        const changes = await this.db(TABLE_NAME).where({ id }).delete();
        if (!changes) {
            throw new EmployeeNotFoundError(id);
        }
        return existing;
    }

    async getEmployee(id: string): Promise<Employee> {
        const row = await this.db<Employee>(TABLE_NAME).where({ id }).first();
        if (!row) {
            throw new EmployeeNotFoundError(id);
        }
        return { ...row, avatar: row.avatar ?? "" };
    }
    async save(): Promise<void> {
        await this.db.destroy();
    }
}
