"use client";

import { useState, useEffect, use } from "react";
import { Link } from "@/i18n/routing";
import apiClient from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useTranslations } from "next-intl";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  category_id?: number;
}

interface Category {
  id: number;
  name: string;
}

export default function StorefrontProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('Products');
  const nt = useTranslations('Navigation');
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchProducts = async (isSearch = false) => {
    setLoading(true);
    try {
      const paramsObj: any = {};
      if (search) paramsObj.search = search;
      if (selectedCategory) paramsObj.category_id = selectedCategory;
      if (priceRange.min) paramsObj.min_price = priceRange.min;
      if (priceRange.max) paramsObj.max_price = priceRange.max;

      const response = await apiClient.get("/products/", { params: paramsObj });
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(true);
  };

  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black tracking-tighter">
          <span className="bg-black text-white px-2 py-1 rounded mr-1">Sell</span>
          Masr
        </Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 relative hidden md:block">
          <input 
            type="text" 
            placeholder={isRtl ? "ابحث عن منتج..." : "Search products..."}
            className={`w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black ${isRtl ? 'text-right' : 'text-left'}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-3 opacity-30`}>🔍</button>
        </form>
        <div className="flex gap-6 text-sm font-bold">
          <Link href="/products" className="text-blue-600">{t('title')}</Link>
          <Link href="/checkout" className="relative flex items-center">
            🛒 {nt('cart')}
            {cart.length > 0 && (
              <span className={`absolute -top-2 ${isRtl ? '-left-3' : '-right-3'} bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full`}>
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row gap-12">
        <aside className={`w-full md:w-64 space-y-10 shrink-0 ${isRtl ? 'order-last md:order-first' : ''}`}>
          <div>
            <h3 className={`text-sm font-black uppercase tracking-widest text-gray-400 mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t('filters.categories')}
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedCategory === null ? "bg-black text-white" : "hover:bg-gray-100"
                }`}
              >
                {t('filters.allCategories')}
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedCategory === cat.id ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "hover:bg-gray-100"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-black uppercase tracking-widest text-gray-400 mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t('filters.priceRange')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="number" 
                placeholder={t('filters.min')}
                dir="ltr"
                className={`bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${isRtl ? 'text-right' : 'text-left'}`}
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              />
              <input 
                type="number" 
                placeholder={t('filters.max')}
                dir="ltr"
                className={`bg-white border border-gray-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${isRtl ? 'text-right' : 'text-left'}`}
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              />
            </div>
            <button 
              onClick={() => fetchProducts()}
              className="w-full mt-4 bg-gray-100 text-gray-900 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
            >
              {t('filters.apply')}
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className={`flex justify-between items-end mb-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <h2 className={`text-3xl font-black tracking-tight ${isRtl ? 'text-right' : 'text-left'}`}>
              {loading ? t('searching') : t('found', { count: products.length })}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-gray-100">
                  <p className={`text-gray-400 text-xl mb-4 ${isRtl ? 'text-right' : 'text-left'}`}>{t('noResults')}</p>
                  <button 
                    onClick={() => {setSearch(""); setSelectedCategory(null); setPriceRange({min:"", max:""}); fetchProducts();}}
                    className={`text-blue-600 font-bold hover:underline ${isRtl ? 'text-right' : 'text-left'} block w-full`}
                  >
                    {t('clearFilters')}
                  </button>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-2">
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square relative overflow-hidden bg-gray-50 product-image">
                        {product.image_url ? (
                          <img 
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${product.image_url}`} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
                        )}
                      </div>
                    </Link>
                    <div className="p-6 space-y-3">
                      <Link href={`/products/${product.id}`}>
                        <h3 className={`font-bold text-lg leading-tight line-clamp-1 hover:text-blue-600 transition-colors ${isRtl ? 'text-right' : 'text-left'}`}>{product.name}</h3>
                      </Link>
                      <p className={`text-gray-500 text-sm line-clamp-2 h-10 ${isRtl ? 'text-right' : 'text-left'}`}>{product.description}</p>
                      <div className={`flex justify-between items-center pt-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xl font-black text-blue-600">
                          {t('price', { price: isRtl ? product.price.toLocaleString('ar-EG') : product.price })}
                        </span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-black text-white p-3 rounded-2xl hover:bg-gray-800 transition-colors shadow-lg active:scale-95 text-sm"
                        >
                          ➕ {t('addToCart')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
