import { Knex } from "knex";
import AbstractEmployeesServiceSql from "./AbstractEmployeesServiceSql.ts";
import { register } from "module";
import { registerEmployeesService } from "./registry.ts";
class EmployeesServiceSql extends AbstractEmployeesServiceSql {
    constructor(config: Knex.Config) {
        super(config);
    }
}
registerEmployeesService("sql", async () => {
    const host = process.env.SQL_HOST;
    const user = process.env.SQL_USER;
    const port = process.env.SQL_PORT ?? 5432;
    const database = process.env.SQL_DB_NAME;
    const password = process.env.SQL_PASSWORD;
    const client = process.env.SQL_CLIENT
    const serviceInstance = new EmployeesServiceSql({
        client,
        connection: {
            host,
            user,
            port: +port,
            password
        }
    })
    await serviceInstance.createTable();
    return serviceInstance
})
