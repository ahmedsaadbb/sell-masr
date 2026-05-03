"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";

interface Product {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
  category_id?: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/products/");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Products</h1>
          <p className="text-gray-500 mt-2">Manage your product catalog and inventory.</p>
        </div>
        <Link 
          href="/dashboard/products/new" 
          className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl active:scale-95"
        >
          ➕ Add Product
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 font-bold text-sm text-gray-400 uppercase tracking-widest">Product</th>
              <th className="px-8 py-5 font-bold text-sm text-gray-400 uppercase tracking-widest">Price</th>
              <th className="px-8 py-5 font-bold text-sm text-gray-400 uppercase tracking-widest">Stock</th>
              <th className="px-8 py-5 font-bold text-sm text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-8 py-8 h-20 bg-gray-50/50"></td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-gray-400">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-lg">{product.name}</div>
                    <div className="text-xs text-gray-400 font-mono mt-1">ID: #{product.id}</div>
                  </td>
                  <td className="px-8 py-6 font-black text-blue-600">EGP {product.price}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.stock_quantity > 10 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                      {product.stock_quantity} in stock
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <Link 
                      href={`/dashboard/products/edit/${product.id}`}
                      className="inline-block p-3 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all"
                    >
                      ✏️
                    </Link>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-3 bg-gray-100 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                      🗑️
                    </button>
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
