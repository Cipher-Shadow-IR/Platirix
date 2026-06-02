"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch(`${API}/menu${category ? `?category=${category}` : ""}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.success ? data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [category]);

  async function addToCart(menuItemId) {
    const res = await fetch(`${API}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, quantity: 1 }),
    });
    if (res.ok) alert("Added to cart!");
    else alert("Failed to add to cart");
  }

  const categories = [...new Set(items.map((i) => i.category))];

  if (loading) return <div className="text-center py-20 text-xl">Loading menu...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Our Menu</h1>
      <p className="text-gray-600 mb-6">Freshly prepared, delivered to your door.</p>

      <div className="flex gap-2 mb-8 flex-wrap">
        <button onClick={() => setCategory("")} className={`px-4 py-2 rounded-full text-sm font-medium transition ${!category ? "bg-brand-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>All</button>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === c ? "bg-brand-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}>{c}</button>
        ))}
      </div>

      {items.length === 0 && <p className="text-gray-500 text-center py-12">No items found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border p-5 flex flex-col">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            <p className="text-brand-600 font-bold text-xl mt-3">${Number(item.price).toFixed(2)}</p>
            {item.category && <span className="text-xs bg-gray-100 self-start px-2 py-1 rounded mt-2">{item.category}</span>}
            <button onClick={() => addToCart(item.id)} className="mt-4 w-full bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 transition font-medium">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
