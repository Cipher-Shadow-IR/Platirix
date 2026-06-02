const { pool } = require("../src/config/db");
const fs = require("fs");
const path = require("path");

async function setupDB() {
  const schema = fs.readFileSync(
    path.resolve(__dirname, "../src/models/schema.sql"),
    "utf8"
  );
  await pool.query(schema);
}

async function teardownDB() {
  await pool.end();
}

module.exports = { setupDB, teardownDB };
