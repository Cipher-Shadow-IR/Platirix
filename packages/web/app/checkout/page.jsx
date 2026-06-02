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

  if (loading) return <div className="text-center py-20 text-xl">Loading checkout...</div>;

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <p className="text-2xl text-green-700 font-semibold mb-2">Order Confirmed!</p>
          <p className="text-green-600">{success}</p>
          <p className="text-sm text-gray-500 mt-4">Redirecting to order details...</p>
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

      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
            <form onSubmit={placeOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${formErrors.name ? "border-red-400" : "border-gray-300"}`}
                  placeholder="John Doe"
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${formErrors.address ? "border-red-400" : "border-gray-300"}`}
                  placeholder="123 Main St, Apt 4B, New York, NY 10001"
                />
                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${formErrors.phone ? "border-red-400" : "border-gray-300"}`}
                  placeholder="+1 (555) 123-4567"
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={placing}
                className="w-full bg-brand-600 text-white py-3 rounded-lg hover:bg-brand-700 transition font-medium text-lg disabled:opacity-50"
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
