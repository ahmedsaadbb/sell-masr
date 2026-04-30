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
        setCategories([{ id: 1, name: "أزياء" }, { id: 2, name: "إلكترونيات" }]);
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
      alert("تم رفع الصورة بنجاح!");
    } catch (error) {
      alert("فشل في رفع الصورة");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) return alert("يرجى اختيار فئة");
    
    setLoading(true);
    try {
      await apiClient.post("/products/", {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category_id: parseInt(formData.category_id)
      });
      alert("تم إنشاء المنتج بنجاح!");
      router.push("/dashboard/products");
    } catch (error) {
      alert("فشل في إنشاء المنتج");
      console.error(error);
    } finally {
      setLoading(false);
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
          <Link href="/dashboard/products" className="flex items-center gap-3 bg-white/10 p-3 rounded-xl font-bold transition-all rtl-flex-row">
            <span>🏷️</span> المنتجات
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 text-right">
              إضافة منتج جديد
            </h1>
            <p className="text-gray-500 text-right">أدخل تفاصيل المنتج الجديد للإدراج في المنصة</p>
          </div>
          <Link href="/dashboard/products" className="text-gray-500 font-bold hover:text-black rtl-flex-row">
            ← الإلغاء
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-right">معلومات أساسية</h3>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 block text-right">اسم المنتج</label>
                <input
                  type="text"
                  required
                  dir="rtl"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black text-right"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="أدخل اسم المنتج"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1 rtl-flex-row">
                  <label className="text-sm font-bold text-gray-700">الوصف</label>
                  <button 
                    type="button"
                    onClick={async () => {
                      if (!formData.name) return alert("يرجى إدخال اسم المنتج أولاً.");
                      const catName = categories.find(c => c.id.toString() === formData.category_id)?.name || "";
                      setLoading(true);
                      try {
                        const res = await apiClient.post("/ai/generate-description", {
                          product_name: formData.name,
                          category_name: catName
                        });
                        setFormData({...formData, description: res.data.description});
                      } catch (err) {
                        alert("فشل في توليد الوصف. تأكد من إعداد مفتاح OpenAI في الإعدادات.");
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1 rtl-flex-row"
                  >
                    ✨ توليد بالذكاء الاصطناعي
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  dir="rtl"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black text-right"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="أدخل وصف المنتج بالتفصيل..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 block text-right">السعر (جنيه مصري)</label>
                  <input
                    type="number"
                    required
                    dir="ltr"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black text-right"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 block text-right">الكمية في المخزون</label>
                  <input
                    type="number"
                    required
                    dir="ltr"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black text-right"
                    value={formData.stock_quantity}
                    onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-xl font-bold mb-4 text-right">التصنيف والباركود</h3>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 block text-right">SKU (الباركود)</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black text-right"
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    placeholder="PROD-001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 block text-right">الفئة</label>
                  <select
                    dir="rtl"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">اختر فئة</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-xl font-bold mb-4 text-right">وسائط المنتج</h3>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-gray-50 rounded-3xl p-12 text-center hover:border-blue-100 transition-all group cursor-pointer overflow-hidden relative rtl-flex-col"
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
                      <p className="text-sm font-bold text-gray-400 text-right">  {/* <-- تحديث النص بالعربية */}
                        {uploading ? "جاري الرفع..." : "انقر لرفع صورة"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 rtl-flex-row">  {/* <-- عكس الترتيب */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-blue-600 text-white px-12 py-5 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? "جاري النشر..." : "نشر المنتج"}  {/* <-- تحديث النص بالعربية */}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
