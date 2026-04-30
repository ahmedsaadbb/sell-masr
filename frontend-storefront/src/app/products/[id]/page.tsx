"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/api";
import { useCart } from "@/context/CartContext";

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

export default function ProductDetailPage() {
  const { id } = useParams();
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
    try {
      await apiClient.post("/reviews/", {
        ...newReview,
        product_id: parseInt(id as string),
        user_id: 1 // Mock user for now
      });
      // Refresh reviews
      const response = await apiClient.get(`/reviews/product/${id}`);
      setReviews(response.data);
      setNewReview({ rating: 5, comment: "" });
      alert("تم إرسال المراجعة بنجاح!");
    } catch (error) {
      alert("فشل في إرسال المراجعة");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center">جاري تحميل المنتج...</div>;
  if (!product) return <div className="p-20 text-center">المنتج غير موجود.</div>;

  return (
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <Link href="/products" className="text-2xl font-black tracking-tighter">
          <span className="bg-black text-white px-2 py-1 rounded mr-1">Sell</span>
          Masr
        </Link>
        <div className="flex gap-6 text-sm font-bold rtl-flex-row">
          <Link href="/products" className="text-blue-600">كل المنتجات</Link>
          <Link href="/checkout" className="relative flex items-center">
            🛒 السلة
            {cart.length > 0 && (
              <span className="absolute -top-2 -left-3 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div className="aspect-square bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 relative">
            {product.image_url ? (
              <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${product.image_url}`} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
            )}
          </div>

          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight text-right">{product.name}</h1>
              <p className="text-2xl font-bold text-blue-600 text-right">{product.price.toLocaleString('ar-EG')} جنيه</p>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed text-right">{product.description}</p>
            
            <div className="space-y-4">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-right">التوافر</p>
              <div className="flex items-center gap-2 justify-end">
                <span className={`w-3 h-3 rounded-full ${product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"}`}></span>
                <span className="font-bold text-right">
                  {product.stock_quantity > 0 ? `${product.stock_quantity} وحدة متوفرة` : "غير متوفر"}
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-4 flex-row-reverse">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-black text-white text-center py-5 rounded-3xl font-black text-xl hover:bg-gray-800 transition-all shadow-xl active:scale-95"
              >
                أضف للسلة
              </button>
              <Link href="/checkout" className="flex-1 bg-blue-600 text-white text-center py-5 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                تسوّق الآن
              </Link>
            </div>
          </div>
        </div>

        <section className="border-t border-gray-100 pt-20">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="md:col-span-2 space-y-12">
              <h2 className="text-3xl font-black tracking-tight text-right">مراجعات العملاء</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-400 italic text-right">لا توجد مراجعات بعد. كن أول من يراجع هذا المنتج!</p>
              ) : (
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                      <div className="flex justify-between items-center mb-4 rtl-flex-row">
                        <span className="font-bold text-lg">{review.user_name}</span>
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-right">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-4 font-bold uppercase tracking-tighter text-right">
                        {new Date(review.created_at).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm h-fit">
              <h3 className="text-xl font-bold mb-6 text-right">اترك مراجعة</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 block text-right">التقييم</label>
                  <select 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-right"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                    dir="rtl"
                  >
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} نجوم</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1 block text-right">تعليقك</label>
                  <textarea 
                    rows={4}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-right"
                    placeholder="أخبرنا برأيك..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    dir="rtl"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 text-right"
                >
                  {submitting ? "جاري الإرسال..." : "نشر المراجعة"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
    };
    if (id) fetchData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiClient.post("/reviews/", {
        ...newReview,
        product_id: parseInt(id as string),
        user_id: 1 // Mock user for now
      });
      // Refresh reviews
      const response = await apiClient.get(`/reviews/product/${id}`);
      setReviews(response.data);
      setNewReview({ rating: 5, comment: "" });
      alert("Review submitted!");
    } catch (error) {
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading product...</div>;
  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center">
        <Link href="/products" className="text-2xl font-black tracking-tighter">
          <span className="bg-black text-white px-2 py-1 rounded mr-1">Sell</span>
          Masr
        </Link>
        <div className="flex gap-6 text-sm font-bold">
          <Link href="/products" className="text-blue-600">All Products</Link>
          <Link href="/checkout" className="relative flex items-center">
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          {/* Image */}
          <div className="aspect-square bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 relative">
             {product.image_url ? (
                <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${product.image_url}`} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">📦</div>
              )}
          </div>

          {/* Details */}
          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight">{product.name}</h1>
              <p className="text-2xl font-bold text-blue-600">EGP {product.price}</p>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            
            <div className="space-y-4">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Availability</p>
               <div className="flex items-center gap-2">
                 <span className={`w-3 h-3 rounded-full ${product.stock_quantity > 0 ? "bg-green-500" : "bg-red-500"}`}></span>
                 <span className="font-bold">{product.stock_quantity > 0 ? `${product.stock_quantity} units in stock` : "Out of stock"}</span>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-black text-white text-center py-5 rounded-3xl font-black text-xl hover:bg-gray-800 transition-all shadow-xl active:scale-95"
              >
                Add to Cart
              </button>
              <Link href="/checkout" className="flex-1 bg-blue-600 text-white text-center py-5 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl active:scale-95">
                Checkout
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="border-t border-gray-100 pt-20">
          <div className="grid md:grid-cols-3 gap-16">
            {/* Reviews List */}
            <div className="md:col-span-2 space-y-12">
              <h2 className="text-3xl font-black tracking-tight">Customer Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-400 italic">No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-lg">{review.user_name}</span>
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      <p className="text-xs text-gray-400 mt-4 font-bold uppercase tracking-tighter">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm h-fit">
              <h3 className="text-xl font-bold mb-6">Leave a Review</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Rating</label>
                  <select 
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                  >
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Your Comment</label>
                  <textarea 
                    rows={4}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Tell us what you think..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Post Review"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
