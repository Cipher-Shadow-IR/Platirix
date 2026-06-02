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
      { name: "Margherita Pizza", desc: "Classic tomato, mozzarella, and fresh basil on a thin crust", price: 12.99, cat: "Pizza", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop" },
      { name: "Pepperoni Pizza", desc: "Loaded with pepperoni and melted mozzarella cheese", price: 14.99, cat: "Pizza", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop" },
      { name: "BBQ Chicken Pizza", desc: "Smoked chicken with tangy BBQ sauce and red onions", price: 16.99, cat: "Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
      { name: "Classic Cheeseburger", desc: "Juicy beef patty with cheddar, pickles, and special sauce", price: 10.99, cat: "Burger", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
      { name: "Chicken Burger", desc: "Grilled chicken breast with lettuce, tomato, and mayo", price: 11.99, cat: "Burger", img: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop" },
      { name: "Veggie Burger", desc: "Plant-based patty with fresh vegetables and avocado", price: 9.99, cat: "Burger", img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop" },
      { name: "California Roll", desc: "Crab, avocado, and cucumber wrapped in seasoned rice", price: 8.99, cat: "Sushi", img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop" },
      { name: "Spicy Tuna Roll", desc: "Fresh tuna with spicy mayo and cucumber", price: 9.99, cat: "Sushi", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop" },
      { name: "Salmon Nigiri", desc: "Fresh Atlantic salmon over seasoned sushi rice", price: 11.99, cat: "Sushi", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" },
      { name: "Tiramisu", desc: "Classic Italian coffee dessert with mascarpone cream", price: 6.99, cat: "Dessert", img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop" },
      { name: "Chocolate Lava Cake", desc: "Warm chocolate cake with a molten center", price: 7.99, cat: "Dessert", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop" },
      { name: "Cola", desc: "Refreshing carbonated cola drink served ice-cold", price: 1.99, cat: "Drinks", img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop" },
      { name: "Lemonade", desc: "Freshly squeezed lemons with a hint of mint", price: 2.99, cat: "Drinks", img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop" },
      { name: "Caesar Salad", desc: "Crisp romaine, parmesan, croutons, and Caesar dressing", price: 8.99, cat: "Salad", img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop" },
      { name: "Greek Salad", desc: "Feta cheese, Kalamata olives, cucumber, and tomato", price: 9.99, cat: "Salad", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop" },
    ];

    for (const item of items) {
      await pool.query(
        `INSERT INTO menu_items (name, description, price, category_id, image_url)
         VALUES ($1,$2,$3,$4,$5)`,
        [item.name, item.desc, item.price, catMap[item.cat], item.img]
      );
    }

    console.log("Seed completed — 15 menu items across 6 categories with images.");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
