import express, {RequestHandler, Router} from 'express';
import { Employee } from "../../model/dto-types/Employee.ts";
import validation from "../../middeware/validation/validation.ts";
import service from "../../service/bootstrap.ts";
import {
  EmployeeSchema,
  EmployeeSchemaPartial,
} from "../../middeware/validation/schemas.ts";
import { auth } from '../../middeware/auth/auth.ts';
const employeeRoutes = express.Router();
const allAuth: RequestHandler = auth(["USER", "ADMIN"]);
const adminAuth: RequestHandler = auth(["ADMIN"]);
//getting data about all Employee objects, filtered by optional department in query string
employeeRoutes.get("/", allAuth, async (req, res) => {
  res.json(await service.getAll(req.query.department as string));
});
//Adding new employee
employeeRoutes.post("/",adminAuth, validation(EmployeeSchema), async (req, res) => {
  res.json(await service.addEmployee(req.body as Employee));
});
//deleting employee
employeeRoutes.delete("/:id",adminAuth, async (req, res) => {
  res.json(await service.deleteEmployee(req.params.id));
});
//Updating employee
employeeRoutes.patch("/:id", adminAuth, validation(EmployeeSchemaPartial),async(req, res) => {
  res.json(await service.updateEmployee(req.params.id, req.body));
});
export default employeeRoutes;
