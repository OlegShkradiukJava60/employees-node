import "./EmployeesServiceMap.ts"
import "./EmployeesServiceMock.test.ts"
import "./EmployeesServiceSqlite.ts"
import "./EmployeesServiceMongoInMemory.ts"
import { createEmployeesService } from "./registry.ts"
const key = process.argv[2] ?? process.env.EMPLOYEES_IMPL
const service = await createEmployeesService(key);
export default service;