"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/orders`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.success ? data.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-indigo-100 text-indigo-800",
    out_for_delivery: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  if (loading) return <div className="text-center py-20 text-xl">Loading orders...</div>;
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {orders.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">No orders yet</p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-mono">#{order.id.slice(0, 8)}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            <ul className="text-sm text-gray-700 space-y-1 mb-3">
              {order.items?.map((oi, idx) => (
                <li key={idx}>{oi.name} × {oi.quantity}</li>
              ))}
            </ul>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{new Date(order.created_at).toLocaleString()}</span>
              <span className="font-bold">${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
