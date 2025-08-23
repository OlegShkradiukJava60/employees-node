import express from "express";
import morgan from "morgan";
import "dotenv/config";
import _ from "lodash";

import { errorsHandler } from "../../middeware/errors-handling/handler.ts";

import accountingService from "../../service/AccountingServiceMap.ts";
import {  authenticate } from "../../middeware/auth/auth.ts";
import cors from 'cors'
import employeeRoutes from "../routes/employees-router.ts";
const { MORGAN_FORMAT, SKIP_CODE_THRESHOLD } = process.env;
 const morganFormat = (MORGAN_FORMAT ?? "tiny");
const skipCodeThreshold = SKIP_CODE_THRESHOLD ?? 400;
const app = express();



app.use(cors())
app.use(morganFormat === "none" ? morgan(() => null) :
  morgan(morganFormat, {
    skip: (_, res) => res.statusCode < +skipCodeThreshold,
  })
);

app.use(authenticate);
app.use(express.json());
app.use("/employees", employeeRoutes)

app.post("/login", (req, res) => {
  res.json(accountingService.login(req.body));
});
app.use(errorsHandler);

export default app;
