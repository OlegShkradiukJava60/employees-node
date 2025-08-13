import express from "express";
import morgan from "morgan";
import _ from "lodash";

import { Employee } from "../model/Employee.ts";
import service from "../service/EmployeesServiceMap.ts";

import { errorsHandler } from "../middeware/errors-handling/handler.ts";
import validation from "../middeware/validation/validation.ts";
import { EmployeeSchema, EmployeeSchemaPartial } from "../middeware/validation/schemas.ts";
import { getRandomEmployees } from "../utils/service-helpers.ts";
import accountingService from "../service/AccountingServiceMap.ts";

import { authenticate } from "../middeware/auth/auth.ts";

const { PORT, MORGAN_FORMAT, SKIP_CODE_THRESHOLD } = process.env as any;
const port = PORT || 3500;

const morganFormat = MORGAN_FORMAT ?? "tiny";
const skipCodeThreshold = SKIP_CODE_THRESHOLD ?? 400;

const app = express();
const server = app.listen(port, () =>
  console.log("server is listening on port " + port)
);

app.use(express.json());
app.use(
  morgan(morganFormat, {
    skip: (_, res) => res.statusCode < +skipCodeThreshold,
  })
);

app.get("/employees",
  authenticate(["ADMIN", "USER"]),
  (req, res) => {
    res.json(service.getAll(req.query.department as string));
  }
);

app.post("/employees",
  authenticate(["ADMIN"]),
  validation(EmployeeSchema),
  (req, res) => {
    res.json(service.addEmployee(req.body as Employee));
  }
);

app.delete("/employees/:id",
  authenticate(["ADMIN"]),
  (req, res) => {
    res.json(service.deleteEmployee(req.params.id));
  }
);

app.patch("/employees/:id",
  authenticate(["ADMIN"]),
  validation(EmployeeSchemaPartial),
  (req, res) => {
    res.json(service.updateEmployee(req.params.id, req.body));
  }
);

app.post("/login", (req, res) => {
  res.send(accountingService.login(req.body));
});

// централизованный обработчик ошибок (последним!)
app.use(errorsHandler);

function shutdown() {
  server.close(() => {
    console.log("server closed");
    service.save();
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);


if (process.env.NODE_ENV !== "production") {
  if (service.getAll().length === 0) {
    const employees = getRandomEmployees();
    employees.forEach((empl) => service.addEmployee(empl));
  }
}
