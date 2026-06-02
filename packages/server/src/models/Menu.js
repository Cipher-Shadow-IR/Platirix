const { pool } = require("../config/db");

const Menu = {
  async findAll({ category } = {}) {
    let query = `
      SELECT mi.*, c.name AS category
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE mi.available = true
    `;
    const params = [];
    if (category) {
      query += ` AND c.name = $1`;
      params.push(category);
    }
    query += ` ORDER BY mi.name`;
    const { rows } = await pool.query(query, params);
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT mi.*, c.name AS category
       FROM menu_items mi
       LEFT JOIN categories c ON mi.category_id = c.id
       WHERE mi.id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, description, price, categoryId, imageUrl }) {
    const { rows } = await pool.query(
      `INSERT INTO menu_items (name, description, price, category_id, image_url)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, description, price, categoryId || null, imageUrl || null]
    );
    return rows[0];
  },
};

module.exports = Menu;
