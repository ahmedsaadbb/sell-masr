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
      case "pending":
      case "قيد الانتظار":
        return "bg-orange-50 text-orange-600";
      case "processing":
      case "قيد المعالجة":
        return "bg-blue-50 text-blue-600";
      case "shipped":
      case "تم التوصيل":
      case "shipped":
        return "bg-purple-50 text-purple-600";
      case "delivered":
      case "مكتمل":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      <aside className="w-64 bg-black text-white p-8 space-y-12 shrink-0">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="bg-white text-black px-2 py-1 rounded mr-1">Sell</span>
          Masr
        </div>
        <nav className="space-y-4 rtl-flex-row">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white transition-all rtl-flex-row">
            <span>📊</span> لوحة التحكم
          </Link>
          <Link href="/dashboard/orders" className="flex items-center gap-3 bg-white/10 p-3 rounded-xl font-bold transition-all rtl-flex-row">
            <span>📦</span> الطلبات
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white transition-all rtl-flex-row">
            <span>🏷️</span> المنتجات
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-right">إدارة الطلبات</h1>
          <p className="text-gray-500 text-right">تتبع وإدارة طلبات العملاء</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg text-right">لا توجد طلبات حتى الآن.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-50">
                      <th className="pb-4 font-bold uppercase tracking-widest text-right">رقم الطلب</th>
                      <th className="pb-4 font-bold uppercase tracking-widest text-right">العميل</th>
                      <th className="pb-4 font-bold uppercase tracking-widest text-right">التاريخ</th>
                      <th className="pb-4 font-bold uppercase tracking-widest text-right">المبلغ</th>
                      <th className="pb-4 font-bold uppercase tracking-widest text-right">الحالة</th>
                      <th className="pb-4 font-bold uppercase tracking-widest text-right">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-6 font-bold text-gray-900 text-right">#{order.id}</td>
                        <td className="py-6 text-right">
                          <div>
                            <p className="font-bold">{order.customer_name}</p>
                            <p className="text-xs text-gray-400">{order.customer_phone}</p>
                          </div>
                        </td>
                        <td className="py-6 text-sm text-gray-500 text-right">
                          {new Date(order.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-6 font-black text-gray-900 text-right">
                          {order.total_amount.toLocaleString('ar-EG')} جنيه
                        </td>
                        <td className="py-6 text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                            {order.status === "pending" && "قيد الانتظار"}
                            {order.status === "processing" && "قيد المعالجة"}
                            {order.status === "shipped" && "تم التوصيل"}
                            {order.status === "delivered" && "مكتمل"}
                            {order.status}
                          </span>
                        </td>
                        <td className="py-6 text-right">
                          <button className="text-blue-600 font-bold text-sm hover:underline">
                            عرض التفاصيل
                          </button>
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
