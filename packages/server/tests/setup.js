const { pool } = require("../src/config/db");
const fs = require("fs");
const path = require("path");

beforeAll(async () => {
  const schema = fs.readFileSync(
    path.resolve(__dirname, "../src/models/schema.sql"),
    "utf8"
  );
  await pool.query(schema);
});

afterAll(async () => {
  await pool.end();
});
