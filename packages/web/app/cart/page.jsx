"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function fetchCart() {
    setLoading(true);
    fetch(`${API}/cart`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.success ? data.data || [] : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => { fetchCart(); }, []);

  async function updateQty(id, qty) {
    if (qty < 1) return;
    await fetch(`${API}/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty }),
    });
    fetchCart();
  }

  async function removeItem(id) {
    await fetch(`${API}/cart/${id}`, { method: "DELETE" });
    fetchCart();
  }

  const total = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);

  if (loading) return <div className="text-center py-20 text-xl text-neutral-500 dark:text-neutral-400">Loading cart...</div>;
  if (error) return <div className="text-center py-20 text-red-600 dark:text-red-400">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-medium text-gray-900 dark:text-neutral-100 mb-8">Your Cart</h1>

      {items.length === 0 && (
        <div className="text-center py-16 text-neutral-400 dark:text-neutral-500">
          <p className="text-xl font-light mb-4">Your cart is empty</p>
          <Link href="/" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors">Browse Menu</Link>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm dark:shadow-neutral-900/50 p-5 flex items-center justify-between transition-colors duration-300">
            <div>
              <h3 className="font-serif font-medium text-gray-900 dark:text-neutral-100">{item.name}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">${Number(item.price).toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden">
                <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white/50 dark:hover:bg-black/20 transition-colors font-medium">-</button>
                <span className="w-8 text-center font-medium text-sm text-gray-900 dark:text-neutral-100">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white/50 dark:hover:bg-black/20 transition-colors font-medium">+</button>
              </div>
              <button onClick={() => removeItem(item.id)} className="ml-1 text-sm font-medium text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-8 border-t border-neutral-200/50 dark:border-neutral-800/50 pt-6">
          <div className="flex justify-between text-xl font-medium text-gray-900 dark:text-neutral-100 mb-5">
            <span>Total</span>
            <span className="font-serif">${total.toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full text-center bg-brand-600 dark:bg-brand-500 text-white py-3.5 rounded-xl hover:bg-brand-700 dark:hover:bg-brand-400 transition-colors duration-300 font-medium"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
