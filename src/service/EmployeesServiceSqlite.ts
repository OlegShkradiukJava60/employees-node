import AbstractEmployeesServiceSql from "./AbstractEmployeesServiceSql.ts";
import {Knex} from 'knex'
import { registerEmployeesService } from "./registry.ts";
class EmployeesServiceSqlite extends AbstractEmployeesServiceSql {
    constructor(config: Knex.Config) {
        super(config);
    }
}
registerEmployeesService("sqlite", async () => {
    const serviceInstance = new EmployeesServiceSqlite({
        client: "sqlite3",
        connection: {
            filename: process.env.SQLITE_FILE_NAME ?? "employees.sqlite"
            
        },
        useNullAsDefault: true
    })
    await serviceInstance.createTable();
    return serviceInstance
})