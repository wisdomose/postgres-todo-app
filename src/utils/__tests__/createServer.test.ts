const request = require("supertest");
const { app } = require("../createServer");

describe("Test server health", () => {
  test("It should response the Health route", () => {
    return request(app).get("/health").expect(200);
  });
});
