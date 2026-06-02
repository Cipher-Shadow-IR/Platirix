const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const menuRoutes = require("./routes/menu");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Platirix API is running" });
});

app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Platirix server listening on http://localhost:${PORT}`);
});

module.exports = app;
