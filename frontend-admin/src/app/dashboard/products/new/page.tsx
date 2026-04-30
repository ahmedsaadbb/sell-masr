"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/api";

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    sku: "",
    category_id: "",
    image_url: ""
  });

  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        // Fallback for demo
        setCategories([{ id: 1, name: "Fashion" }, { id: 2, name: "Electronics" }]);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await apiClient.post("/media/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFormData({ ...formData, image_url: response.data.url });
    } catch (error) {
      alert("Failed to upload image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) return alert("Please select a category");
    
    setLoading(true);
    try {
      await apiClient.post("/products/", {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: parseInt(formData.category_id)
      });
      router.push("/dashboard/products");
    } catch (error) {
      alert("Failed to create product");
      console.error(error);
    } finally {
      setLoading(false);
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
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Add New Product</h1>
            <p className="text-gray-500">Fill in the details to list a new item</p>
          </div>
          <Link href="/dashboard/products" className="text-gray-500 font-bold hover:text-black">
            Cancel
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Basic Information</h3>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Product Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-gray-700">Description</label>
                  <button 
                    type="button"
                    onClick={async () => {
                      if (!formData.name) return alert("Please enter a product name first.");
                      const catName = categories.find(c => c.id.toString() === formData.category_id)?.name || "";
                      setLoading(true);
                      try {
                        const res = await apiClient.post("/ai/generate-description", {
                          product_name: formData.name,
                          category_name: catName
                        });
                        setFormData({...formData, description: res.data.description});
                      } catch (err: any) {
                        alert(err.response?.data?.detail || "Failed to generate description. Make sure OpenAI key is set in Settings.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    ✨ Generate with AI
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Price (EGP)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Stock</label>
                  <input
                    type="number"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-xl font-bold mb-4">Inventory & Category</h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">SKU</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                  <select
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-xl font-bold mb-4">Product Media</h3>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-gray-50 rounded-3xl p-12 text-center hover:border-blue-100 transition-all group cursor-pointer overflow-hidden relative"
                >
                  {formData.image_url ? (
                    <img 
                      src={`http://localhost:8000${formData.image_url}`} 
                      alt="Preview" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📸</div>
                      <p className="text-sm font-bold text-gray-400">{uploading ? "Uploading..." : "Click to upload image"}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-blue-600 text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Product"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
