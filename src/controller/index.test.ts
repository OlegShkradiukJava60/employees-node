import supertest from "supertest";
 
import test from "node:test";
import assert from "assert/strict"
import app from "./routes/mainRoutes.ts";
test("get employees with 401", async () => {
    const response = await supertest(app).get("/employees");
    
  assert.equal(response.statusCode, 401)
})
test("get employees with 200", async () => {
    const response = await supertest(app).get("/employees").set("Authorization","Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiVVNFUiIsImlhdCI6MTc1NTEwMDAzMCwic3ViIjoidXNlckB0ZWwtcmFuLmNvbSJ9.Ph5Wr_ojNczB742bNZ85EHJpMsp1IFCGzxJLss3hzZg");
    
  assert.equal(response.statusCode, 200);
  assert.ok(Array.isArray(response.body))
})
