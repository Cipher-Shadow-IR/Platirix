"use client";

import { useState, useEffect, useCallback } from "react";
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
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-indigo-100 text-indigo-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API}/orders`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
      else setError(data.error?.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  function progressPercent(status) {
    if (status === "cancelled") return 0;
    const idx = STATUS_FLOW.indexOf(status);
    return idx >= 0 ? ((idx + 1) / STATUS_FLOW.length) * 100 : 0;
  }

  if (loading) return <div className="text-center py-20 text-xl">Loading orders...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {orders.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl mb-4">No orders yet</p>
          <Link href="/" className="text-brand-600 hover:underline">Browse Menu</Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <div className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500 font-mono">#{order.id.slice(0, 8)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              {order.status !== "cancelled" && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent(order.status)}%` }}
                  />
                </div>
              )}

              <ul className="text-sm text-gray-700 space-y-1 mb-3">
                {order.items?.slice(0, 3).map((oi, idx) => (
                  <li key={idx}>{oi.name} × {oi.quantity}</li>
                ))}
                {order.items?.length > 3 && (
                  <li className="text-gray-400">+{order.items.length - 3} more items</li>
                )}
              </ul>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{new Date(order.created_at).toLocaleString()}</span>
                <span className="font-bold">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
