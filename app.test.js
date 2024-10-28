const request = require("supertest");
const app = require("./app");

describe("GET /partners", () => {
  it("should return partners and a true result", async () => {
    const res = await request(app).get("/partners");

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
  });
});
