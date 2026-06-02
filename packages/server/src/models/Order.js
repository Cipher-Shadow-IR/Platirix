const { pool } = require("../config/db");

const STATUS_FLOW = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];

const Order = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC`
    );
    for (const order of rows) {
      const { rows: items } = await pool.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order.id]
      );
      order.items = items;
    }
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [id]
    );
    if (rows.length === 0) return null;
    const order = rows[0];
    const { rows: items } = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [order.id]
    );
    order.items = items;
    return order;
  },

  async createFromCart({ customerName, customerAddress, customerPhone } = {}) {
    const { rows: cartItems } = await pool.query(
      `SELECT ci.menu_item_id, ci.quantity, mi.name, mi.price
       FROM cart_items ci
       JOIN menu_items mi ON ci.menu_item_id = mi.id`
    );

    if (cartItems.length === 0) {
      const err = new Error("Cart is empty");
      err.status = 400;
      err.expose = true;
      throw err;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { rows: orderRows } = await client.query(
        `INSERT INTO orders (total, customer_name, customer_address, customer_phone)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [total, customerName || null, customerAddress || null, customerPhone || null]
      );
      const order = orderRows[0];

      for (const item of cartItems) {
        await client.query(
          `INSERT INTO order_items (order_id, menu_item_id, name, price, quantity)
           VALUES ($1, $2, $3, $4, $5)`,
          [order.id, item.menu_item_id, item.name, item.price, item.quantity]
        );
      }

      await client.query("DELETE FROM cart_items");

      await client.query("COMMIT");

      const { rows: items } = await pool.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order.id]
      );
      order.items = items;
      return order;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async updateStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (rows.length === 0) return null;
    const order = rows[0];
    const { rows: items } = await pool.query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [order.id]
    );
    order.items = items;
    return order;
  },

  async advanceNextStatus() {
    const { rows } = await pool.query(
      `SELECT * FROM orders WHERE status != 'delivered' AND status != 'cancelled'
       ORDER BY created_at ASC LIMIT 1`
    );
    if (rows.length === 0) return null;

    const order = rows[0];
    const currentIdx = STATUS_FLOW.indexOf(order.status);
    if (currentIdx === -1 || currentIdx >= STATUS_FLOW.length - 1) return null;

    const nextStatus = STATUS_FLOW[currentIdx + 1];
    return Order.updateStatus(order.id, nextStatus);
  },
};

module.exports = Order;
