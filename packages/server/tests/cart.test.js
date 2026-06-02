const request = require("supertest");
const app = require("../src/index");
const { pool } = require("../src/config/db");
const { setupDB, teardownDB } = require("./setup");

beforeAll(async () => { await setupDB(); });
afterAll(async () => { await teardownDB(); });

describe("Cart API", () => {
  let menuItemId;

  beforeAll(async () => {
    const { rows } = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING id",
      ["CartTest"]
    );
    const catId = rows[0].id;
    const { rows: items } = await pool.query(
      `INSERT INTO menu_items (name, description, price, category_id)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ["Cart Test Item", "For cart testing", 5.99, catId]
    );
    menuItemId = items[0].id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM cart_items");
    await pool.query("DELETE FROM menu_items WHERE id = $1", [menuItemId]);
    await pool.query("DELETE FROM categories WHERE name = 'CartTest'");
  });

  afterEach(async () => {
    await pool.query("DELETE FROM cart_items");
  });

  describe("POST /api/cart", () => {
    it("adds item to cart", async () => {
      const res = await request(app)
        .post("/api/cart")
        .send({ menuItemId, quantity: 2 });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("rejects invalid menuItemId", async () => {
      const res = await request(app)
        .post("/api/cart")
        .send({ menuItemId: 99999, quantity: 1 });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/cart", () => {
    it("returns cart items", async () => {
      await request(app).post("/api/cart").send({ menuItemId, quantity: 1 });
      const res = await request(app).get("/api/cart");
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe("PATCH /api/cart/:id", () => {
    it("updates item quantity", async () => {
      const add = await request(app).post("/api/cart").send({ menuItemId, quantity: 1 });
      const cartId = add.body.data.id;
      const res = await request(app)
        .patch(`/api/cart/${cartId}`)
        .send({ quantity: 5 });
      expect(res.status).toBe(200);
      expect(res.body.data.quantity).toBe(5);
    });
  });

  describe("DELETE /api/cart/:id", () => {
    it("removes item from cart", async () => {
      const add = await request(app).post("/api/cart").send({ menuItemId, quantity: 1 });
      const cartId = add.body.data.id;
      const res = await request(app).delete(`/api/cart/${cartId}`);
      expect(res.status).toBe(200);
    });
  });
});
