import supertest from "supertest";
import test from "node:test";
import assert from "assert/strict"
import app from "./routes/mainRoutes.ts";
import JwtUtil from "../security/JwtUtil.ts";
import { Employee } from "../model/dto-types/Employee.ts";
import LoginData from "../model/dto-types/LoginData.ts";
console.log("JWT_SECRET", process.env.JWT_SECRET);
console.log("MORGAN_FORMAT", process.env.MORGAN_FORMAT)
const emplRight: Employee = {
  avatar: "",
  birthDate: "2000-01-01",
  department: "QA",
  fullName: "Vasya Ivanov",
  salary: 10000,
}
const emplWrong: Employee = {
  avatar: "kuku",
  birthDate: "1900-01-01",
  department: "Q",
  fullName: "",
  salary: 1000,
}
const fields: string[] = Object.keys(emplRight);
test("get employees with 401", async () => {
    const response = await supertest(app).get("/employees");
    
  assert.equal(response.statusCode, 401)
})
const adminToken = JwtUtil.getJWT({
      username: "admin@tel-ran.com",
      role: "ADMIN",
      password: "password",
    })
    const userToken = JwtUtil.getJWT({
      username: "user@tel-ran.com",
      role: "USER",
      password: "password",
    })
    const adminAuthHeader = "Bearer " + adminToken;
    const userAuthHeader = "Bearer " + userToken;
    const loginCorrect: LoginData = {
      email: "user@tel-ran.com",
      password: "user1234"
    }
    const loginIncorrect: LoginData = {
      email: "user@tel-ran.com",
      password: "user12345"
    }
test("get employees with 200 for USER", async () => {
    const response = await supertest(app).get("/employees").set("Authorization", userAuthHeader);
    
  assert.equal(response.statusCode, 200);
  assert.ok(Array.isArray(response.body))
})
test("get employees with 200 for ADMIN", async () => {
    const response = await supertest(app).get("/employees").set("Authorization",adminAuthHeader);
    
  assert.equal(response.statusCode, 200);
  assert.ok(Array.isArray(response.body))
})
test("add employee with 401 code", async () => {
  const response = await supertest(app).post("/employees").send(emplRight)
  assert.equal(response.statusCode, 401); //no token
})
test("add employee with 403 code no ADMIN", async () => {
  const response =  await supertest(app).post("/employees").set("Authorization", userAuthHeader ).send(emplRight)
  assert.equal(response.statusCode, 403); 
})
test("add employee with 400 code auth - ok, validation - invalid", async () => {
  const response =  await supertest(app).post("/employees").set("Authorization", adminAuthHeader ).send(emplWrong)
  assert.equal(response.statusCode, 400); 
  assert.ok(fields.every(f => response.text.includes(f)))
})
test("add employee with 200 code auth - ok, validation - ok", async () => {
  const response =  await supertest(app).post("/employees").set("Authorization", adminAuthHeader ).send(emplRight)
  assert.equal(response.statusCode, 200); 
  assert.ok(response.body),
  assert.ok(!response.error)
})
test("login with 400 code, wrong credentials", async () => {
  const response = await supertest(app).post("/login").send(loginIncorrect);
  assert.equal(response.statusCode, 400);
  assert.equal(response.text,"Wrong Credentials");
  assert.equal(Object.keys(response.body).length, 0);
})
test("login with 200 code, token is returned", async () => {
  const response = await supertest(app).post("/login").send(loginCorrect);
  assert.equal(response.statusCode, 200);
  assert.ok(!response.error);
  const{accessToken, user} = response.body;
  assert.ok((accessToken as string).length > 10);
  assert.equal((user as any).email, loginCorrect.email);
  assert.equal((user as any).id, "USER");
})
test("update employee with 401 code, no token ", async () => {
  const response = await supertest(app).patch("/employees/123").send({salary:20000})
  assert.equal(response.statusCode, 401)
})
test("update employee with 403 code, no permision ", async () => {
  const response = await supertest(app).patch("/employees/123").set("Authorization",userAuthHeader).send({salary:20000})
  assert.equal(response.statusCode, 403)
})
test("update employee with 400 code, validation - invalid ", async () => {
  const response = await supertest(app).patch("/employees/123").set("Authorization",adminAuthHeader).send({salary:2000})
  assert.equal(response.statusCode, 400);
  assert.ok(response.text.includes("salary"))
})
test("update employee with 200 code", async () => {
  const response = await supertest(app).patch("/employees/123").set("Authorization",adminAuthHeader).send({salary:20000})
  assert.equal(response.statusCode, 200);
  
})
test("delete employee with 401 code, no token", async () => {
  const response = await supertest(app).delete("/employees/123");
  assert.equal(response.statusCode, 401)
})
test("delete employee with 403 code, no permission", async () => {
  const response = await supertest(app).delete("/employees/123").set("Authorization", userAuthHeader);
  assert.equal(response.statusCode, 403)
})
test("delete employee with 200 code", async () => {
  const response = await supertest(app).delete("/employees/123").set("Authorization", adminAuthHeader);
  assert.equal(response.statusCode, 200)
})
