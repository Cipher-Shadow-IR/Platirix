const request = require("supertest");
const app = require("../src/index");
const { pool } = require("../src/config/db");

describe("Order API", () => {
  let menuItemId;

  beforeAll(async () => {
    const { rows } = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING id",
      ["OrderTest"]
    );
    const catId = rows[0].id;
    const { rows: items } = await pool.query(
      `INSERT INTO menu_items (name, description, price, category_id)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Order Test Item", "For order testing", 7.99, catId]
    );
    menuItemId = items[0].id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM order_items");
    await pool.query("DELETE FROM orders");
    await pool.query("DELETE FROM cart_items");
    await pool.query("DELETE FROM menu_items WHERE id = $1", [menuItemId]);
    await pool.query("DELETE FROM categories WHERE name = 'OrderTest'");
  });

  beforeEach(async () => {
    await pool.query("DELETE FROM order_items");
    await pool.query("DELETE FROM orders");
    await pool.query("DELETE FROM cart_items");
  });

  describe("POST /api/orders", () => {
    it("creates order from cart", async () => {
      await request(app).post("/api/cart").send({ menuItemId, quantity: 2 });
      const res = await request(app).post("/api/orders");
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("pending");
      expect(Number(res.body.data.total)).toBe(15.98);
    });

    it("rejects empty cart", async () => {
      const res = await request(app).post("/api/orders");
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/orders", () => {
    it("lists orders", async () => {
      await request(app).post("/api/cart").send({ menuItemId, quantity: 1 });
      await request(app).post("/api/orders");
      const res = await request(app).get("/api/orders");
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe("PATCH /api/orders/:id/status", () => {
    it("updates order status", async () => {
      await request(app).post("/api/cart").send({ menuItemId, quantity: 1 });
      const created = await request(app).post("/api/orders");
      const orderId = created.body.data.id;

      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: "confirmed" });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("confirmed");
    });

    it("rejects invalid status", async () => {
      await request(app).post("/api/cart").send({ menuItemId, quantity: 1 });
      const created = await request(app).post("/api/orders");
      const orderId = created.body.data.id;

      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: "invalid_status" });
      expect(res.status).toBe(400);
    });
  });
});
