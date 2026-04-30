"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders/");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-orange-50 text-orange-600";
      case "processing": return "bg-blue-50 text-blue-600";
      case "shipped": return "bg-purple-50 text-purple-600";
      case "delivered": return "bg-green-50 text-green-600";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-black text-white p-8 space-y-12 shrink-0">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="bg-white text-black px-2 py-1 rounded mr-1">Sell</span>
          Masr
        </div>
        <nav className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white transition-all">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/dashboard/orders" className="flex items-center gap-3 bg-white/10 p-3 rounded-xl font-bold transition-all">
            <span>📦</span> Orders
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white transition-all">
            <span>🏷️</span> Products
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Orders</h1>
          <p className="text-gray-500">Track and manage customer orders</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No orders found yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-50">
                      <th className="pb-4 font-bold uppercase tracking-widest">Order ID</th>
                      <th className="pb-4 font-bold uppercase tracking-widest">Customer</th>
                      <th className="pb-4 font-bold uppercase tracking-widest">Date</th>
                      <th className="pb-4 font-bold uppercase tracking-widest">Amount</th>
                      <th className="pb-4 font-bold uppercase tracking-widest">Status</th>
                      <th className="pb-4 font-bold uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-6 font-bold text-gray-900">#SM-{order.id}</td>
                        <td className="py-6">
                          <div>
                            <p className="font-bold">{order.customer_name}</p>
                            <p className="text-xs text-gray-400">{order.customer_phone}</p>
                          </div>
                        </td>
                        <td className="py-6 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-6 font-black text-gray-900">EGP {order.total_amount}</td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-6">
                          <button className="text-blue-600 font-bold text-sm hover:underline">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
