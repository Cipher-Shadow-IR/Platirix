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

  if (loading) return <div className="text-center py-20 text-xl text-neutral-500 dark:text-neutral-400">Loading menu...</div>;
  if (error) return <div className="text-center py-20 text-red-600 dark:text-red-400">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-5xl font-serif font-medium text-gray-900 dark:text-neutral-100 tracking-tight">Our Menu</h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-light text-lg mt-2 max-w-xl">
          Freshly prepared, delivered to your door.
        </p>
      </div>

      <div className="flex gap-2 mb-10 flex-wrap">
        <button
          onClick={() => setCategory("")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            !category
              ? "bg-brand-600 text-white shadow-md"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              category === c
                ? "bg-brand-600 text-white shadow-md"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-neutral-400 dark:text-neutral-500 text-center py-16 font-light">No items found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col h-full bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-neutral-900/50 dark:hover:shadow-neutral-800/50 transition-all duration-300"
            >
              {item.image_url && (
                <div className="relative w-full aspect-[16/11] overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {item.category && (
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {item.category}
                    </span>
                  )}
                </div>
              )}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-serif font-medium text-gray-900 dark:text-neutral-100">
                    {item.name}
                  </h3>
                  <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
                    {item.description}
                  </p>
                </div>
                <div>
                  <p className="text-base text-brand-600 dark:text-brand-400 font-medium mt-3">
                    ${Number(item.price).toFixed(2)}
                  </p>
                  <div className="flex items-center mt-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden">
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantities((prev) => ({ ...prev, [item.id]: Math.max(1, (prev[item.id] || 1) - 1) }))}
                      className="w-9 h-9 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white/50 dark:hover:bg-black/20 transition-colors duration-200 font-medium"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium text-sm text-gray-900 dark:text-neutral-100">
                      {quantities[item.id] || 1}
                    </span>
                    <button
                      onClick={() => setQuantities((prev) => ({ ...prev, [item.id]: (prev[item.id] || 1) + 1 }))}
                      className="w-9 h-9 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white/50 dark:hover:bg-black/20 transition-colors duration-200 font-medium"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(item.id, item.name)}
                    className="flex-1 h-9 bg-brand-600 dark:bg-brand-500 text-white text-xs font-medium hover:bg-brand-700 dark:hover:bg-brand-400 transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))}
      </div>
    </div>
  );
}
