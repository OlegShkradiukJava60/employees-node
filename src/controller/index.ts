import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import 'dotenv/config'
import _ from 'lodash'
import { EmployeeAlreadyExistsError, EmployeeNotFoundError } from '../service/EmployeesServiceMap.ts';
import { Employee } from '../model/Employee.ts';
import service from '../service/EmployeesServiceMap.ts';
import { employeeZod } from '../validation/employeeZod.ts';
import { restoreFromFile, saveToFile } from '../model/persistence.ts';

const app = express();
const { PORT, MORGAN_FORMAT, 
    SKIP_CODE_THRESHOLD,
     EMPLOYEES_FILE } = process.env;
const port = PORT || 3500;
const FILE = EMPLOYEES_FILE || './data/employees.json';
const morganFormat = MORGAN_FORMAT ?? 'tiny';
const skipCodeThreshold = SKIP_CODE_THRESHOLD ?? 400;

app.use(express.json());
app.use(morgan(morganFormat,
     { skip: (req, res) => res.statusCode < +skipCodeThreshold }));

restoreFromFile(service, FILE);

app.get("/employees", (req, res) => {
    res.json(service.getAll(req.query.department as string))
})

app.post("/employees", (req, res, next) => {
    const check = employeeZod.safeParse(req.body);
    if (!check.success) {
        return res.status(400).json(check.error.issues);
    }
    try {
        const created = service.addEmployee(check.data as Employee);
        res.status(201).json(created);
    } catch (e) {
        next(e);
    }
})

app.delete("/employees/:id", (req, res, next) => {
    try {
        res.json(service.deleteEmployee(req.params.id))
    } catch (e) {
        next(e);
    }
})

app.patch("/employees/:id", (req, res, next) => {
    const body = { ...req.body, id: req.params.id };
    const check = employeeZod.partial().extend({ id: employeeZod.shape.id }).safeParse(body);
    if (!check.success) {
        return res.status(400).json(check.error.issues);
    }
    try {
        const updated = service.updateEmployee(req.params.id, check.data);
        res.json(updated);
    } catch (e) {
        next(e);
    }
})

app.use((error: Error, __: Request, res: Response, ___: NextFunction) => {
    let status = 400;
    if (error instanceof EmployeeAlreadyExistsError) {
        status = 409;
    } else if (error instanceof EmployeeNotFoundError) {
        status = 404;
    }
    res.status(status).send(error.message)
})

const server = app.listen(port, () => console.log("server is listening on port " + port))
function shutdown(signal: string) {
    console.log(`\n${signal} received. Saving to file...`);
    saveToFile(service, FILE);
    server.close(() => {
        console.log("server closed");
        process.exit(0);
    });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
