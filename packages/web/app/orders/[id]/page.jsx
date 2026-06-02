"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const STATUS_FLOW = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const STATUS_LABELS = {
  pending: "Order Received",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const STATUS_DESCRIPTIONS = {
  pending: "We've received your order and are reviewing it.",
  confirmed: "Your order has been confirmed and will be prepared shortly.",
  preparing: "Your food is being prepared by our chefs.",
  out_for_delivery: "Your order is on its way!",
  delivered: "Your order has been delivered. Enjoy!",
  cancelled: "This order has been cancelled.",
};
function StatusIcon({ status, className = "w-8 h-8" }) {
  const props = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5 };
  const icons = {
    pending: (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    confirmed: (
      <svg {...props}>
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    preparing: (
      <svg {...props}>
        <path d="M17 8l-5-5-5 5" />
        <path d="M17 16l-5 5-5-5" />
        <path d="M8 12h8" />
      </svg>
    ),
    out_for_delivery: (
      <svg {...props}>
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polygon points="16,8 20,8 22,12 22,16 16,16" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    delivered: (
      <svg {...props}>
        <path d="M3 12h2l2 5 3-8 3 8 2-5h2" />
        <path d="M5 18h14" />
      </svg>
    ),
    cancelled: (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  };
  return icons[status] || null;
}

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
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="text-center py-20 text-xl text-neutral-500 dark:text-neutral-400">Loading order...</div>;
  if (error) return <div className="text-center py-20 text-red-600 dark:text-red-400">{error}</div>;
  if (!order) return <div className="text-center py-20 text-neutral-400 dark:text-neutral-500 font-light">Order not found</div>;

  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/orders" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium text-sm transition-colors inline-block mb-6">&larr; Back to Orders</Link>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm dark:shadow-neutral-900/50 p-7 mb-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-serif font-medium text-gray-900 dark:text-neutral-100 font-mono">#{order.id.slice(0, 8)}</h1>
          <span className="text-brand-600 dark:text-brand-400"><StatusIcon status={order.status} className="w-9 h-9" /></span>
        </div>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 font-light mb-5">{new Date(order.created_at).toLocaleString()}</p>

        <div className={`p-5 rounded-xl mb-6 ${isCancelled ? "bg-red-50 dark:bg-red-900/20" : "bg-brand-50 dark:bg-brand-900/20"}`}>
          <p className={`font-serif font-medium ${isCancelled ? "text-red-700 dark:text-red-400" : "text-brand-700 dark:text-brand-300"}`}>
            {STATUS_LABELS[order.status] || order.status}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">
            {STATUS_DESCRIPTIONS[order.status] || ""}
          </p>
        </div>

        {!isCancelled && (
          <div className="mb-6">
            <div className="relative">
              {STATUS_FLOW.map((s, i) => {
                const isActive = i <= currentIdx;
                const isLast = i === STATUS_FLOW.length - 1;
                return (
                  <div key={s} className="flex items-start mb-0">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? "bg-brand-600 dark:bg-brand-500 text-white" : "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500"
                      }`}>
                        {i + 1}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-10 ${isActive && i < currentIdx ? "bg-brand-600 dark:bg-brand-500" : "bg-neutral-200 dark:bg-neutral-700"}`} />
                      )}
                    </div>
                    <div className={`pb-8 ${isActive ? "text-gray-900 dark:text-neutral-100" : "text-neutral-400 dark:text-neutral-500"}`}>
                      <p className="font-medium text-sm">{STATUS_LABELS[s]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <h2 className="font-serif font-medium text-lg text-gray-900 dark:text-neutral-100 mb-4">Items</h2>
        <div className="space-y-2 mb-6">
          {order.items?.map((oi, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-900 dark:text-neutral-100">{oi.name} <span className="text-neutral-400 dark:text-neutral-500 font-light">×{oi.quantity}</span></span>
              <span className="font-medium text-gray-900 dark:text-neutral-100">${(Number(oi.price) * oi.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200/50 dark:border-neutral-800/50 pt-5 flex justify-between text-lg font-medium text-gray-900 dark:text-neutral-100">
          <span>Total</span>
          <span className="font-serif">${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      {order.customer_name && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm dark:shadow-neutral-900/50 p-7 transition-colors duration-300">
          <h2 className="font-serif font-medium text-lg text-gray-900 dark:text-neutral-100 mb-4">Delivery Details</h2>
          <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400 font-light">
            <p><span className="font-medium text-gray-900 dark:text-neutral-100">Name:</span> {order.customer_name}</p>
            <p><span className="font-medium text-gray-900 dark:text-neutral-100">Address:</span> {order.customer_address}</p>
            <p><span className="font-medium text-gray-900 dark:text-neutral-100">Phone:</span> {order.customer_phone}</p>
          </div>
        </div>
      )}
    </div>
  );
}
