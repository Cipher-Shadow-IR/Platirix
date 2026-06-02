const { pool } = require("./db");

async function seed() {
  try {
    await pool.query("DELETE FROM order_items");
    await pool.query("DELETE FROM orders");
    await pool.query("DELETE FROM cart_items");
    await pool.query("DELETE FROM menu_items");
    await pool.query("DELETE FROM categories");

    const categories = ["Pizza", "Burger", "Sushi", "Dessert", "Drinks", "Salad"];
    const catRows = [];
    for (const name of categories) {
      const { rows } = await pool.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING id",
        [name]
      );
      catRows.push({ name, id: rows[0].id });
    }
    const catMap = Object.fromEntries(catRows.map((c) => [c.name, c.id]));

    const items = [
      { name: "Margherita Pizza", desc: "Classic tomato, mozzarella, basil", price: 12.99, cat: "Pizza" },
      { name: "Pepperoni Pizza", desc: "Loaded with pepperoni and cheese", price: 14.99, cat: "Pizza" },
      { name: "BBQ Chicken Pizza", desc: "Smoked chicken with BBQ sauce", price: 16.99, cat: "Pizza" },
      { name: "Classic Cheeseburger", desc: "Beef patty with cheddar and pickles", price: 10.99, cat: "Burger" },
      { name: "Chicken Burger", desc: "Grilled chicken with lettuce and mayo", price: 11.99, cat: "Burger" },
      { name: "Veggie Burger", desc: "Plant-based patty with fresh veggies", price: 9.99, cat: "Burger" },
      { name: "California Roll", desc: "Crab, avocado, cucumber", price: 8.99, cat: "Sushi" },
      { name: "Spicy Tuna Roll", desc: "Fresh tuna with spicy mayo", price: 9.99, cat: "Sushi" },
      { name: "Salmon Nigiri", desc: "Fresh salmon over seasoned rice", price: 11.99, cat: "Sushi" },
      { name: "Tiramisu", desc: "Classic Italian coffee dessert", price: 6.99, cat: "Dessert" },
      { name: "Chocolate Lava Cake", desc: "Warm chocolate with molten center", price: 7.99, cat: "Dessert" },
      { name: "Cola", desc: "Refreshing carbonated drink", price: 1.99, cat: "Drinks" },
      { name: "Lemonade", desc: "Freshly squeezed lemon drink", price: 2.99, cat: "Drinks" },
      { name: "Caesar Salad", desc: "Romaine, croutons, parmesan", price: 8.99, cat: "Salad" },
      { name: "Greek Salad", desc: "Feta, olives, cucumber, tomato", price: 9.99, cat: "Salad" },
    ];

    for (const item of items) {
      await pool.query(
        `INSERT INTO menu_items (name, description, price, category_id)
         VALUES ($1,$2,$3,$4)`,
        [item.name, item.desc, item.price, catMap[item.cat]]
      );
    }

    console.log("Seed completed — 15 menu items across 6 categories.");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
