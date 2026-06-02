const { pool } = require("./db");
const fs = require("fs");
const path = require("path");

async function migrate() {
  const schema = fs.readFileSync(
    path.resolve(__dirname, "../models/schema.sql"),
    "utf8"
  );
  try {
    await pool.query(schema);
    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
