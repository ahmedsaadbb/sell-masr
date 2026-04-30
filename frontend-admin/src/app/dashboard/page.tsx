"use client";

import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    { label: "Total Orders", value: "1,234", change: "+12%", color: "blue" },
    { label: "Total Revenue", value: "EGP 45,678", change: "+8%", color: "green" },
    { label: "Active Vendors", value: "89", change: "+5%", color: "purple" },
    { label: "Products", value: "567", change: "+2%", color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-8 space-y-12">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="bg-white text-black px-2 py-1 rounded mr-1">Sell</span>
          Masr
        </div>
        <nav className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 bg-white/10 p-3 rounded-xl font-bold transition-all">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/dashboard/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-white">
            <span>📦</span> Orders
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-white">
            <span>🏷️</span> Products
          </Link>
          <Link href="/dashboard/vendors" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-gray-400 hover:text-white">
            <span>👥</span> Vendors
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-gray-500">Welcome back, Admin!</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white border border-gray-200 p-2 rounded-full shadow-sm hover:shadow-md transition-all">
              🔔
            </button>
            <div className="w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black">{stat.value}</h3>
              <p className={`text-xs font-bold mt-4 inline-block px-2 py-1 rounded-full ${
                stat.change.startsWith("+") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>
                {stat.change} from last month
              </p>
            </div>
          ))}
        </div>

        {/* Recent Orders Table Placeholder */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-blue-600 font-bold hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-gray-50">
                  <th className="pb-4 font-bold uppercase tracking-widest">Order ID</th>
                  <th className="pb-4 font-bold uppercase tracking-widest">Customer</th>
                  <th className="pb-4 font-bold uppercase tracking-widest">Status</th>
                  <th className="pb-4 font-bold uppercase tracking-widest">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[1, 2, 3, 4, 5].map((order) => (
                  <tr key={order} className="hover:bg-gray-50 transition-colors">
                    <td className="py-6 font-bold text-gray-700">#SM-120{order}</td>
                    <td className="py-6 font-medium">Ahmed Saad</td>
                    <td className="py-6">
                      <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Processing</span>
                    </td>
                    <td className="py-6 font-black text-gray-900">EGP 1,250</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
