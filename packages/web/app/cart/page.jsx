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

  if (loading) return <div className="text-center py-20 text-xl">Loading cart...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link href="/" className="text-brand-600 hover:underline">Browse Menu</Link>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">${Number(item.price).toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold">-</button>
              <span className="font-medium w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 font-bold">+</button>
              <button onClick={() => removeItem(item.id)} className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="block w-full text-center bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 transition font-medium">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
