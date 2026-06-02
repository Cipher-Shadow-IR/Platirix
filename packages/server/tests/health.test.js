const request = require("supertest");
const app = require("../src/index");
const { setupDB, teardownDB } = require("./setup");

beforeAll(async () => { await setupDB(); });
afterAll(async () => { await teardownDB(); });

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/running/);
  });
});
