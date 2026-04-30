"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/api";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    shipping_address: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderPayload = {
        ...formData,
        user_id: 1, // Mock user ID
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price_at_order: item.price
        })),
        total_amount: total
      };

      await apiClient.post("/orders/", orderPayload);
      alert("Order placed successfully!");
      clearCart();
      router.push("/products");
    } catch (error) {
      alert("Failed to place order. Check stock or details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left: Shipping Form */}
        <div className="space-y-8">
          <Link href="/products" className="text-gray-500 hover:text-black font-bold flex items-center gap-2">
            ← Back to Shopping
          </Link>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h1 className="text-3xl font-black mb-8">Shipping Details</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Phone Number (Egyptian)</label>
                <input
                  type="tel"
                  required
                  placeholder="01xxxxxxxxx"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Delivery Address</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                  placeholder="City, District, Building, Apartment..."
                  value={formData.shipping_address}
                  onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                />
              </div>
              
              <div className="pt-4">
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
                  <p className="text-blue-700 text-sm font-bold flex items-center gap-2">
                    ℹ️ Payment Method: Cash on Delivery (COD)
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Complete Order"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black mb-8">Order Summary</h2>
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">👕</div>
                  <div className="flex-1">
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    <p className="font-black mt-1">EGP {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 pt-10 border-t border-gray-50 space-y-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>EGP {total}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-bold text-sm uppercase tracking-tighter">Free for launch</span>
              </div>
              <div className="flex justify-between text-2xl font-black pt-4">
                <span>Total</span>
                <span className="text-blue-600">EGP {total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
