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
  stock_quantity: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = use(params);
  const t = useTranslations('ProductDetail');
  const nt = useTranslations('Navigation');
  const pt = useTranslations('Products');
  const { cart, addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, reviewRes] = await Promise.all([
          apiClient.get(`/products/${id}`),
          apiClient.get(`/reviews/product/${id}`)
        ]);
        setProduct(prodRes.data);
        setReviews(reviewRes.data);
      } catch (error) {
        console.error("Failed to fetch product details", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (newReview.comment.length < 10) {
      alert(isRtl ? "يجب أن يكون التعليق 10 أحرف على الأقل." : "Comment must be at least 10 characters long.");
      setSubmitting(false);
      return;
    }
    try {
      await apiClient.post("/reviews/", {
        ...newReview,
        product_id: parseInt(id as string),
        // user_id: 1 // REMOVED as per Phase 1 Step 2
      });
      // Refresh reviews
      const response = await apiClient.get(`/reviews/product/${id}`);
      setReviews(response.data);
      setNewReview({ rating: 5, comment: "" });
      alert(t('reviewSuccess'));
    } catch (error) {
      alert(t('reviewError'));
    } finally {
      setSubmitting(false);
    }
  };

  const isRtl = locale === 'ar';

  if (loading) return <div className="p-20 text-center">{t('loading')}</div>;
  if (!product) return <div className="p-20 text-center">{t('notFound')}</div>;

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter">
          <span className="bg-black text-white px-2 py-1 rounded mr-1">Sell</span>
          Masr
        </Link>
        <div className="flex gap-6 text-sm font-bold">
          <Link href="/products" className="text-blue-600">{pt('title')}</Link>
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

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className={`grid md:grid-cols-2 gap-16 mb-20 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="aspect-square bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 relative">
            {product.image_url ? (
              <img 
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${product.image_url}`} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
            )}
          </div>

          <div className={`space-y-8 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight">{product.name}</h1>
              <p className="text-2xl font-bold text-blue-600">
                {pt('price', { price: isRtl ? product.price.toLocaleString('ar-EG') : product.price })}
              </p>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            
            <div className="space-y-4">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('availability')}</p>
              <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className={`w-3 h-3 rounded-full ${product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className="font-bold">
                  {product.stock_quantity > 0 
                    ? t('inStock', { count: product.stock_quantity }) 
                    : t('outOfStock')}
                </span>
              </div>
            </div>

            <div className={`flex gap-4 pt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-black text-white text-center py-5 rounded-3xl font-black text-xl hover:bg-gray-800 transition-all shadow-xl active:scale-95"
              >
                {pt('addToCart')}
              </button>
              <Link href="/checkout" className="flex-1 bg-blue-600 text-white text-center py-5 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                {t('buyNow')}
              </Link>
            </div>
          </div>
        </div>

        <section className="border-t border-gray-100 pt-20">
          <div className={`grid md:grid-cols-3 gap-16 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className="md:col-span-2 space-y-12">
              <h2 className={`text-3xl font-black tracking-tight ${isRtl ? 'text-right' : 'text-left'}`}>{t('customerReviews')}</h2>
              {reviews.length === 0 ? (
                <p className={`text-gray-400 italic ${isRtl ? 'text-right' : 'text-left'}`}>{t('noReviews')}</p>
              ) : (
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                      <div className={`flex justify-between items-center mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className="font-bold text-lg">{review.user_name}</span>
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                          ))}
                        </div>
                      </div>
                      <p className={`text-gray-700 leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>{review.comment}</p>
                      <p className={`text-xs text-gray-400 mt-4 font-bold uppercase tracking-tighter ${isRtl ? 'text-right' : 'text-left'}`}>
                        {new Date(review.created_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm h-fit">
              <h3 className={`text-xl font-bold mb-6 ${isRtl ? 'text-right' : 'text-left'}`}>{t('leaveReview')}</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-sm font-bold text-gray-700 ml-1 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('rating')}</label>
                  <select 
                    className={`w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold ${isRtl ? 'text-right' : 'text-left'}`}
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                    dir={isRtl ? 'rtl' : 'ltr'}
                  >
                    {[5, 4, 3, 2, 1].map(r => (
                      <option key={r} value={r}>
                        {t('stars', { count: r })}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-bold text-gray-700 ml-1 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('yourComment')}</label>
                  <textarea 
                    rows={4}
                    required
                    className={`w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isRtl ? 'text-right' : 'text-left'}`}
                    placeholder={t('commentPlaceholder')}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={submitting}
                  className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 ${isRtl ? 'text-right' : 'text-center'}`}
                >
                  {submitting ? t('submitting') : t('postReview')}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
