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
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  confirmed: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  preparing: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
  out_for_delivery: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  delivered: "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
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

  if (loading) return <div className="text-center py-20 text-xl text-neutral-500 dark:text-neutral-400">Loading orders...</div>;
  if (error) return <div className="text-center py-20 text-red-600 dark:text-red-400">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-medium text-gray-900 dark:text-neutral-100 mb-8">Your Orders</h1>

      {orders.length === 0 && (
        <div className="text-center py-16 text-neutral-400 dark:text-neutral-500">
          <p className="text-xl font-light mb-4">No orders yet</p>
          <Link href="/" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors">Browse Menu</Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm dark:shadow-neutral-900/50 p-6 hover:shadow-xl dark:hover:shadow-neutral-800/50 hover:-translate-y-0.5 transition-all duration-300 ease-in-out cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-400 dark:text-neutral-500 font-mono">#{order.id.slice(0, 8)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              {order.status !== "cancelled" && (
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 mb-4">
                  <div
                    className="bg-brand-600 dark:bg-brand-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent(order.status)}%` }}
                  />
                </div>
              )}

              <ul className="text-sm text-neutral-600 dark:text-neutral-400 font-light space-y-1 mb-3">
                {order.items?.slice(0, 3).map((oi, idx) => (
                  <li key={idx}>{oi.name} × {oi.quantity}</li>
                ))}
                {order.items?.length > 3 && (
                  <li className="text-neutral-400 dark:text-neutral-500">+{order.items.length - 3} more items</li>
                )}
              </ul>

              <div className="flex justify-between text-sm">
                <span className="text-neutral-400 dark:text-neutral-500 font-light">{new Date(order.created_at).toLocaleString()}</span>
                <span className="font-medium text-gray-900 dark:text-neutral-100">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
