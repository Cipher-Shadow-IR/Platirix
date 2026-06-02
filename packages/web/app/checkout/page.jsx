"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "../../components/Toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [formErrors, setFormErrors] = useState({});

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

  function validateForm() {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.address.trim()) errors.address = "Address is required";
    if (!form.phone.trim()) errors.phone = "Phone is required";
    else if (!/^[\d\s\-+()]{7,20}$/.test(form.phone.trim())) errors.phone = "Enter a valid phone number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setPlacing(true);
    setError(null);
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name.trim(),
          customerAddress: form.address.trim(),
          customerPhone: form.phone.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Order #${data.data.id.slice(0, 8)} placed successfully!`);
        addToast("Order placed successfully!", "success");
        setTimeout(() => router.push(`/orders/${data.data.id}`), 1500);
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

  if (loading) return <div className="text-center py-20 text-xl text-neutral-500 dark:text-neutral-400">Loading checkout...</div>;

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-brand-50 dark:bg-brand-900/30 rounded-2xl p-8">
          <p className="text-2xl text-brand-700 dark:text-brand-300 font-serif font-medium mb-2">Order Confirmed!</p>
          <p className="text-brand-600 dark:text-brand-400">{success}</p>
          <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-4 font-light">Redirecting to order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-medium text-gray-900 dark:text-neutral-100 mb-8">Checkout</h1>

      {items.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-neutral-400 dark:text-neutral-500 font-light mb-4">Your cart is empty</p>
          <Link href="/" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors">Browse Menu</Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-neutral-100 mb-5">Delivery Details</h2>
            <form onSubmit={placeOrder} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-neutral-100 transition-shadow ${formErrors.name ? "ring-2 ring-red-300 dark:ring-red-700" : ""}`}
                  placeholder="John Doe"
                />
                {formErrors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Delivery Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-neutral-100 transition-shadow ${formErrors.address ? "ring-2 ring-red-300 dark:ring-red-700" : ""}`}
                  placeholder="123 Main St, Apt 4B, New York, NY 10001"
                />
                {formErrors.address && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{formErrors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-sm dark:shadow-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-neutral-100 transition-shadow ${formErrors.phone ? "ring-2 ring-red-300 dark:ring-red-700" : ""}`}
                  placeholder="+1 (555) 123-4567"
                />
                {formErrors.phone && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl p-4 text-sm font-light">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-brand-600 dark:bg-brand-500 text-white py-3.5 rounded-xl hover:bg-brand-700 dark:hover:bg-brand-400 transition-colors duration-300 font-medium text-lg disabled:opacity-50"
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-neutral-100 mb-5">Order Summary</h2>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm dark:shadow-neutral-900/50 p-5 space-y-3 transition-colors duration-300">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-900 dark:text-neutral-100">{item.name} <span className="text-neutral-400 dark:text-neutral-500 font-light">×{item.quantity}</span></span>
                  <span className="font-medium text-gray-900 dark:text-neutral-100">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-neutral-200/50 dark:border-neutral-800/50 pt-4 flex justify-between font-medium text-base text-gray-900 dark:text-neutral-100">
                <span>Total</span>
                <span className="font-serif">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
