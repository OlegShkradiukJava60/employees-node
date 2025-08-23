import { Employee } from "../model/dto-types/Employee.ts";
import EmployeesService from "./EmployeesService.ts";
import knex, {Knex} from 'knex';
const TABLE_NAME = "employees"
export default abstract class  AbstractEmployeesServiceSql implements EmployeesService {
    private db: Knex;
    constructor(config: Knex.Config) {
        this.db = knex(config);
    }
    async createTable() {
        const exists = await this.db.schema.hasTable(TABLE_NAME);
        if(!exists) {
           await this.db.schema.createTable(TABLE_NAME, table => {
                table.string("id").primary();
                table.string("fullName");
                table.string("avatar").defaultTo("");
                table.string("birthDate");
                table.integer("salary");
                table.string("department");
            })
        }
    }
    addEmployee(empl: Employee): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    async getAll(department?: string): Promise<Employee[]> {
       const query = this.db<Employee>(TABLE_NAME);
       if(department) {
        query.where({department})
       }
       return await query;
    }
    updateEmployee(id: string, empl: Partial<Employee>): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    deleteEmployee(id: string): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    getEmployee(id: string): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    async save(): Promise<void> {
        await this.db.destroy()
    }
    
}