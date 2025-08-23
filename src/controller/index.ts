
import "dotenv/config";
import _ from "lodash";

import service from "../service/bootstrap.ts";

import { getRandomEmployees } from "../utils/service-helpers.ts";

import app from "./routes/mainRoutes.ts";
const { PORT} = process.env;
const port = PORT || 3500;



const server = app.listen(port, () =>
  console.log("server is listening on port " + port)
);


function shutdown() {
  //graceful shutdown
  server.close(() => {
    console.log("server closed");
    service.save();
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
if (process.env.NODE_ENV !== "production") {
  if ((await service.getAll()).length === 0) {
    const employees = getRandomEmployees();
    employees.forEach((empl) => service.addEmployee(empl));
  }
}
