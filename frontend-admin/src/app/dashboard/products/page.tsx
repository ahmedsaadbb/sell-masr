"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";

interface Product {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
  sku: string;
  image_url?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert("Failed to delete product");
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
          <Link href="/dashboard/products" className="flex items-center gap-3 bg-white/10 p-3 rounded-xl font-bold transition-all">
            <span>🏷️</span> Products
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Products</h1>
            <p className="text-gray-500">Manage your inventory and catalog</p>
          </div>
          <Link href="/dashboard/products/new" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
            <span>+</span> Add Product
          </Link>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg mb-4">No products found.</p>
                <Link href="/dashboard/products/new" className="text-blue-600 font-bold hover:underline">Create your first product</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-50">
                      <th className="pb-4 font-bold uppercase tracking-widest">Product</th>
                      <th className="pb-4 font-bold uppercase tracking-widest">SKU</th>
                      <th className="pb-4 font-bold uppercase tracking-widest">Price</th>
                      <th className="pb-4 font-bold uppercase tracking-widest">Stock</th>
                      <th className="pb-4 font-bold uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                              {product.image_url ? (
                                <img src={`http://localhost:8000${product.image_url}`} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                "🖼️"
                              )}
                            </div>
                            <span className="font-bold text-gray-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-6 font-medium text-gray-500">{product.sku}</td>
                        <td className="py-6 font-black text-gray-900">EGP {product.price}</td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            product.stock_quantity > 20 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                          }`}>
                            {product.stock_quantity} in stock
                          </span>
                        </td>
                        <td className="py-6">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">✏️</button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
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
