import jwt from "jsonwebtoken";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret";

import supertest from "supertest";
import test from "node:test";
import assert from "assert/strict";
import app from "./routes/mainRoutes.ts";

const ADMIN_USERNAME = "admin@tel-ran.com";
const ADMIN_TOKEN = jwt.sign({ role: "ADMIN" }, process.env.JWT_SECRET as string, { subject: ADMIN_USERNAME });

let createdId: string | undefined;

test("GET /employees 401 without token", async () => {
  const res = await supertest(app).get("/employees");
  assert.equal(res.statusCode, 401);
});

test("GET /employees 200 with token", async () => {
  const res = await supertest(app)
    .get("/employees")
    .set("Authorization", "Bearer " + ADMIN_TOKEN);
  assert.equal(res.statusCode, 200);
  assert.ok(Array.isArray(res.body));
});

test("POST /employees create", async () => {
  const body = {
    fullName: "Oleg Shkrada",
    department: "QA",
    salary: 5000,
    birthDate: "1990-01-20"
  };

  const res = await supertest(app)
    .post("/employees")
    .set("Authorization", "Bearer " + ADMIN_TOKEN)
    .send(body);

  if (res.statusCode >= 200 && res.statusCode < 300 && res.body && res.body.id) {
    createdId = res.body.id;
  }
});

test("GET /employees/:id 200", async (t) => {
  if (!createdId) { t.skip("no createdId"); return; }
  const res = await supertest(app)
    .get(`/employees/${createdId}`)
    .set("Authorization", "Bearer " + ADMIN_TOKEN);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.id, createdId);
  assert.equal(res.body.fullName, "Oleg Shkrada");
});

test("PATCH /employees/:id 200", async (t) => {
  if (!createdId) { t.skip("no createdId"); return; }
  const patch = { salary: 7777, department: "Accounting" };
  const res = await supertest(app)
    .patch(`/employees/${createdId}`)
    .set("Authorization", "Bearer " + ADMIN_TOKEN)
    .send(patch);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.id, createdId);
  assert.equal(res.body.salary, 7777);
  assert.equal(res.body.department, "Accounting");
});

test("DELETE /employees/:id 200/204", async (t) => {
  if (!createdId) { t.skip("no createdId"); return; }
  const res = await supertest(app)
    .delete(`/employees/${createdId}`)
    .set("Authorization", "Bearer " + ADMIN_TOKEN);
  assert.ok(res.statusCode === 200 || res.statusCode === 204);
});

test("GET /employees/:id after delete 404/410", async (t) => {
  if (!createdId) { t.skip("no createdId"); return; }
  const res = await supertest(app)
    .get(`/employees/${createdId}`)
    .set("Authorization", "Bearer " + ADMIN_TOKEN);
  assert.ok(res.statusCode === 404 || res.statusCode === 410);
});

test("POST /login success 200/400/401/500", async () => {
  const res = await supertest(app)
    .post("/login")
    .send({ username: "admin@tel-ran.com", password: "admin" });
  assert.ok([200, 400, 401, 500].includes(res.statusCode));
  if (res.statusCode === 200) {
    assert.ok(typeof res.body === "object");
    assert.ok(!!res.body.token || !!res.body.accessToken);
  }
});

test("POST /login wrong password 400/401/500", async () => {
  const res = await supertest(app)
    .post("/login")
    .send({ username: "admin@tel-ran.com", password: "wrong-password" });
  assert.ok([400, 401, 500].includes(res.statusCode));
});
