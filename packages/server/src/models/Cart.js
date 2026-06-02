const { pool } = require("../config/db");

const Cart = {
  async findAll() {
    const { rows } = await pool.query(
      `SELECT ci.id, ci.menu_item_id, ci.quantity, mi.name, mi.price, mi.image_url
       FROM cart_items ci
       JOIN menu_items mi ON ci.menu_item_id = mi.id
       ORDER BY ci.created_at`
    );
    return rows;
  },

  async findByMenuItem(menuItemId) {
    const { rows } = await pool.query(
      "SELECT * FROM cart_items WHERE menu_item_id = $1",
      [menuItemId]
    );
    return rows[0] || null;
  },

  async addOrUpdate(menuItemId, quantity) {
    const existing = await Cart.findByMenuItem(menuItemId);
    if (existing) {
      const newQty = existing.quantity + quantity;
      const { rows } = await pool.query(
        "UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
        [newQty, existing.id]
      );
      return rows[0];
    }
    const { rows } = await pool.query(
      "INSERT INTO cart_items (menu_item_id, quantity) VALUES ($1, $2) RETURNING *",
      [menuItemId, quantity]
    );
    return rows[0];
  },

  async updateQuantity(id, quantity) {
    const { rows } = await pool.query(
      "UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [quantity, id]
    );
    return rows[0] || null;
  },

  async remove(id) {
    const { rowCount } = await pool.query(
      "DELETE FROM cart_items WHERE id = $1",
      [id]
    );
    return rowCount > 0;
  },

  async clear() {
    await pool.query("DELETE FROM cart_items");
  },
};

module.exports = Cart;
