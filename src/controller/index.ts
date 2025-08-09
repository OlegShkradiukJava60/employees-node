import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import 'dotenv/config'
import _ from 'lodash'
import  { EmployeeAlreadyExistsError, EmployeeNotFoundError } from '../service/EmployeesServiceMap.ts';
import { Employee } from '../model/Employee.ts';
import service from '../service/EmployeesServiceMap.ts';
const app = express();
const {PORT, MORGAN_FORMAT, SKIP_CODE_THRESHOLD} = process.env;
const port = PORT || 3500;

const morganFormat = MORGAN_FORMAT ?? 'tiny';
const skipCodeThreshold = SKIP_CODE_THRESHOLD ??  400;
const server = app.listen(port, () => console.log("server is listening on port "+ port))
app.use(express.json());
app.use(morgan(morganFormat,{skip: (req, res) => res.statusCode < +skipCodeThreshold}));
//getting data about all Employee objects, filtered by optional department in query string
app.get("/employees", (req, res) => {
    res.json(service.getAll(req.query.department as string))
})
//Adding new employee
app.post("/employees",(req, res) => {
    res.json(service.addEmployee(req.body as Employee))
   
} )
//deleting employee
app.delete("/employees/:id",(req, res) => {
    res.json(service.deleteEmployee(req.params.id))
} )
//Updating employee
app.patch("/employees/:id",(req, res) => {
    res.json(service.updateEmployee(req.params.id, req.body))
} )
app.use((error: Error, __: Request, res: Response, ___: NextFunction) => {
    let status = 400;
    if(error instanceof EmployeeAlreadyExistsError) {
        status = 409;
    } else if (error instanceof EmployeeNotFoundError) {
        status = 404;
    }
    res.statusCode = status;
    res.send(error.message)
    
})
function shutdown() {
    //graceful shutdown
    server.close(() => console.log("server closed"));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown)
