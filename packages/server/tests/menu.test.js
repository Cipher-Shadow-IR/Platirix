const request = require("supertest");
const app = require("../src/index");
const { pool } = require("../src/config/db");

describe("Menu API", () => {
  let categoryId;

  beforeAll(async () => {
    const { rows } = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING id",
      ["TestCategory"]
    );
    categoryId = rows[0].id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM menu_items WHERE category_id = $1", [categoryId]);
    await pool.query("DELETE FROM categories WHERE id = $1", [categoryId]);
  });

  describe("POST /api/menu", () => {
    it("creates a menu item with valid data", async () => {
      const res = await request(app)
        .post("/api/menu")
        .send({ name: "Test Pizza", description: "Test", price: 9.99, categoryId });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Test Pizza");
    });

    it("rejects invalid price", async () => {
      const res = await request(app)
        .post("/api/menu")
        .send({ name: "Bad", price: -5 });
      expect(res.status).toBe(400);
    });

    it("rejects missing name", async () => {
      const res = await request(app)
        .post("/api/menu")
        .send({ price: 10 });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/menu", () => {
    it("returns menu items", async () => {
      const res = await request(app).get("/api/menu");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
