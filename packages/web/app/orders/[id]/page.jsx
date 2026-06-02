"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const STATUS_FLOW = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchOrder() {
      try {
        const res = await fetch(`${API}/orders/${id}`);
        const data = await res.json();
        if (data.success) setOrder(data.data);
        else setError(data.error?.message);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="text-center py-20 text-xl">Loading order...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/orders" className="text-brand-600 hover:underline text-sm mb-4 inline-block">&larr; Back to Orders</Link>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold font-mono">#{order.id.slice(0, 8)}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            isCancelled ? "bg-red-100 text-red-800" : "bg-brand-100 text-brand-800"
          }`}>
            {STATUS_LABELS[order.status] || order.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-6">{new Date(order.created_at).toLocaleString()}</p>

        {!isCancelled && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {STATUS_FLOW.map((s, i) => (
                <span key={s} className={`text-xs font-medium ${i <= currentIdx ? "text-brand-600" : "text-gray-400"}`}>
                  {STATUS_LABELS[s]}
                </span>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-brand-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${((currentIdx + 1) / STATUS_FLOW.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <h2 className="font-semibold text-lg mb-3">Items</h2>
        <div className="space-y-2 mb-6">
          {order.items?.map((oi, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{oi.name} <span className="text-gray-400">×{oi.quantity}</span></span>
              <span className="font-medium">${(Number(oi.price) * oi.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
