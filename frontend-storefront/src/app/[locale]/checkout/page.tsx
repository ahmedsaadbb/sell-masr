"use client";

import { useState, use } from "react";
import { useRouter, Link } from "@/i18n/routing";
import apiClient from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useTranslations } from "next-intl";

export default function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const router = useRouter();
  const t = useTranslations('Checkout');
  const pt = useTranslations('Products');
  const { cart, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    shipping_address: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert(t('emptyCart'));
      return;
    }

    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(formData.customer_phone)) {
      alert(isRtl ? "يرجى إدخال رقم هاتف مصري صحيح (11 رقم يبدأ بـ 01)" : "Please enter a valid Egyptian phone number (11 digits starting with 01)");
      return;
    }
    setLoading(true);
    
    try {
      const orderPayload = {
        ...formData,
        // user_id: 1, // REMOVED as per Phase 1 Step 2
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price_at_order: item.price
        })),
        total_amount: total
      };

      await apiClient.post("/orders/", orderPayload);
      alert(t('success'));
      clearCart();
      router.push("/products");
    } catch (error) {
      alert(isRtl ? "فشل في تقديم الطلب. يرجى التحقق من المخزون أو التفاصيل." : "Failed to place order. Please check stock or details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8">
      <div className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-12 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div className={`space-y-8 ${isRtl ? 'order-last md:order-first' : ''}`}>
          <Link href="/products" className={`text-gray-500 hover:text-black font-bold flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            {isRtl ? "← العودة للتسوق" : "← Back to Shopping"}
          </Link>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h1 className={`text-3xl font-black mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>{t('shippingInfo')}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className={`text-sm font-bold text-gray-700 ml-1 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('fullName')}</label>
                <input
                  type="text"
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                  className={`w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black ${isRtl ? 'text-right' : 'text-left'}`}
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  placeholder={isRtl ? "عبدالله محمد أحمد" : "John Doe"}
                />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-bold text-gray-700 ml-1 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('phone')}</label>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                  className={`w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black ${isRtl ? 'text-right' : 'text-left'}`}
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                />
                <p className={`text-xs text-gray-400 mt-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {isRtl ? "يرجى إدخال رقم هاتف مصري صحيح للتواصل" : "Please enter a valid Egyptian phone number"}
                </p>
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-bold text-gray-700 ml-1 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('address')}</label>
                <textarea
                  required
                  dir={isRtl ? 'rtl' : 'ltr'}
                  rows={3}
                  className={`w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black ${isRtl ? 'text-right' : 'text-left'}`}
                  placeholder={isRtl ? "المدينة، الحي، الشارع، المبنى..." : "City, District, Street, Building..."}
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                />
              </div>
              
              <div className="pt-4">
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
                  <p className={`text-blue-700 text-sm font-bold flex items-center gap-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                    ℹ️ {isRtl ? "طريقة الدفع: الدفع عند الاستلام (كاش)" : "Payment Method: Cash on Delivery (COD)"}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {loading ? t('processing') : t('placeOrder')}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className={`text-2xl font-black mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>{t('orderSummary')}</h2>
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className={`flex gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl product-image">
                    {item.image_url ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}${item.image_url}`} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-2xl" 
                      />
                    ) : (
                      "📦"
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold ${isRtl ? 'text-right' : 'text-left'}`}>{item.name}</h4>
                    <p className={`text-gray-500 text-sm ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}</p>
                    <p className={`font-black mt-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                      {t('subtotal')}: {pt('price', { price: isRtl ? item.price.toLocaleString('ar-EG') : item.price })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-10 border-t border-gray-50 space-y-4">
              <div className={`flex justify-between text-gray-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span>{t('subtotal')}</span>
                <span className={isRtl ? 'text-right' : 'text-left'}>
                  {pt('price', { price: isRtl ? total.toLocaleString('ar-EG') : total })}
                </span>
              </div>
              <div className={`flex justify-between text-gray-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span>{t('shipping')}</span>
                <span className="text-green-600 font-bold text-sm uppercase tracking-tighter">
                  {isRtl ? "مجاني للمنطلقين" : "Free for launch"}
                </span>
              </div>
              <div className={`flex justify-between text-2xl font-black pt-4 border-t border-gray-50 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span>{t('total')}</span>
                <span className="text-blue-600">
                  {pt('price', { price: isRtl ? total.toLocaleString('ar-EG') : total })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
