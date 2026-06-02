"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
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
  }, []);

  async function placeOrder() {
    setPlacing(true);
    setError(null);
    try {
      const res = await fetch(`${API}/orders`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Order #${data.data.id.slice(0, 8)} placed successfully!`);
        setTimeout(() => router.push("/orders"), 1500);
      } else {
        setError(data.error?.message || "Failed to place order");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  const total = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);

  if (loading) return <div className="text-center py-20 text-xl">Loading checkout...</div>;

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <p className="text-2xl text-green-700 font-semibold mb-2">Order Confirmed!</p>
          <p className="text-green-600">{success}</p>
          <p className="text-sm text-gray-500 mt-4">Redirecting to orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {items.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/" className="text-brand-600 hover:underline">Browse Menu</Link>
        </div>
      )}

      <div className="space-y-3 mb-8">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border p-4 flex justify-between">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 transition font-medium text-lg disabled:opacity-50"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}
