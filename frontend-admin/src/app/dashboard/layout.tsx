import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-8 text-2xl font-black tracking-tighter">
          <span className="bg-white text-black px-2 py-1 rounded mr-1">Sell</span>
          Masr Admin
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <Link href="/dashboard" className="block px-4 py-3 rounded-xl hover:bg-gray-900 transition-colors font-bold">
            📊 Overview
          </Link>
          <Link href="/dashboard/products" className="block px-4 py-3 rounded-xl hover:bg-gray-900 transition-colors font-bold">
            📦 Products
          </Link>
          <Link href="/dashboard/orders" className="block px-4 py-3 rounded-xl hover:bg-gray-900 transition-colors font-bold">
            🛒 Orders
          </Link>
          <Link href="/dashboard/categories" className="block px-4 py-3 rounded-xl hover:bg-gray-900 transition-colors font-bold">
            🏷️ Categories
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-900">
          <Link href="/login" className="block px-4 py-3 text-gray-400 hover:text-white transition-colors text-sm font-bold">
            🚪 Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
        {children}
      </main>
    </div>
  );
}
