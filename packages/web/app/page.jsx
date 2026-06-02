"use client";

import { useState, useEffect } from "react";
import { useToast } from "../components/Toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [quantities, setQuantities] = useState({});
  const { addToast } = useToast();

  useEffect(() => {
    fetch(`${API}/menu`)
      .then((r) => r.json())
      .then((data) => {
        const menu = data.success ? data.data : [];
        setAllItems(menu);
        setItems(menu);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!allItems.length) return;
    if (!category) {
      setItems(allItems);
    } else {
      setItems(allItems.filter((i) => i.category === category));
    }
  }, [category, allItems]);

  async function addToCart(menuItemId, name) {
    const qty = quantities[menuItemId] || 1;
    const res = await fetch(`${API}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItemId, quantity: qty }),
    });
    if (res.ok) {
      addToast(`${qty} × ${name} added to cart!`, "success");
      setQuantities((prev) => ({ ...prev, [menuItemId]: 1 }));
    } else {
      addToast("Failed to add to cart", "error");
    }
  }

  const categories = [...new Set(allItems.map((i) => i.category))].sort();

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
          <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            )}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex-1">{item.description}</p>
              <p className="text-brand-600 font-bold text-xl mt-3">${Number(item.price).toFixed(2)}</p>
              {item.category && <span className="text-xs bg-gray-100 self-start px-2 py-1 rounded mt-2">{item.category}</span>}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantities((prev) => ({ ...prev, [item.id]: Math.max(1, (prev[item.id] || 1) - 1) }))}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg font-bold"
                  >−</button>
                  <span className="w-10 text-center font-medium text-sm">{quantities[item.id] || 1}</span>
                  <button
                    onClick={() => setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] || 1) + 1 }))}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg font-bold"
                  >+</button>
                </div>
                <button
                  onClick={() => addToCart(item.id, item.name)}
                  className="flex-1 bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 transition font-medium text-sm"
                >Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
