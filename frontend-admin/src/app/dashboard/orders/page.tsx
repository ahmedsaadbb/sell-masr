"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api";

interface Order {
  id: number;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_phone: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/orders/");
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await apiClient.patch(`/orders/${id}/status?status=${newStatus}`);
      setOrders(orders.map(o => o.id === id ? {...o, status: newStatus} : o));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Orders</h1>
        <p className="text-gray-500 mt-2">Monitor and manage customer orders and fulfillment.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 font-bold text-sm text-gray-400 uppercase tracking-widest">Order ID</th>
              <th className="px-8 py-5 font-bold text-sm text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-8 py-5 font-bold text-sm text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-8 py-5 font-bold text-sm text-gray-400 uppercase tracking-widest">Total</th>
              <th className="px-8 py-5 font-bold text-sm text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 font-bold text-sm text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
               [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-8 py-8 h-20 bg-gray-50/50"></td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-gray-400">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 font-mono text-sm">#{order.id}</td>
                  <td className="px-8 py-6">
                    <div className="font-bold">{order.customer_name}</div>
                    <div className="text-xs text-gray-400">{order.customer_phone}</div>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 font-black">EGP {order.total_amount}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === "delivered" ? "bg-green-50 text-green-700" :
                      order.status === "cancelled" ? "bg-red-50 text-red-700" :
                      "bg-blue-50 text-blue-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <select 
                      className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
