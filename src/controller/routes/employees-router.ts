import express, {RequestHandler, Router} from 'express';
import { Employee } from "../../model/dto-types/Employee.ts";
import validation from "../../middeware/validation/validation.ts";
import service from "../../service/EmployeesServiceMap.ts";
import {
  EmployeeSchema,
  EmployeeSchemaPartial,
} from "../../middeware/validation/schemas.ts";
import { auth } from '../../middeware/auth/auth.ts';
const employeeRoutes = express.Router();
const allAuth: RequestHandler = auth(["USER", "ADMIN"]);
const adminAuth: RequestHandler = auth(["ADMIN"]);
//getting data about all Employee objects, filtered by optional department in query string
employeeRoutes.get("/", allAuth, (req, res) => {
  res.json(service.getAll(req.query.department as string));
});
//Adding new employee
employeeRoutes.post("/",adminAuth, validation(EmployeeSchema), (req, res) => {
  res.json(service.addEmployee(req.body as Employee));
});
//deleting employee
employeeRoutes.delete("/:id",adminAuth, (req, res) => {
  res.json(service.deleteEmployee(req.params.id));
});
//Updating employee
employeeRoutes.patch("/:id", adminAuth, validation(EmployeeSchemaPartial), (req, res) => {
  res.json(service.updateEmployee(req.params.id, req.body));
});
export default employeeRoutes;
