"use client";

import { useState, use } from "react";
import { Link, useRouter } from "@/i18n/routing";
import apiClient from "@/lib/api";
import { useTranslations } from "next-intl";

export default function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('Auth');
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "", 
    full_name: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient.post("/auth/register", formData);
      router.push("/login");
    } catch (err) {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="text-3xl font-black tracking-tighter">
            <span className="bg-black text-white px-2 py-1 rounded mr-1">Sell</span>
            Masr
          </Link>
          <h1 className="text-2xl font-bold pt-4">{t('register')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold text-center">{error}</div>}
          
          <div className="space-y-2">
            <label className={`text-sm font-bold text-gray-700 ml-1 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('fullName')}</label>
            <input 
              type="text" 
              required
              className={`w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isRtl ? 'text-right' : 'text-left'}`}
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-bold text-gray-700 ml-1 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('email')}</label>
            <input 
              type="email" 
              required
              className={`w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isRtl ? 'text-right' : 'text-left'}`}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-bold text-gray-700 ml-1 block ${isRtl ? 'text-right' : 'text-left'}`}>{t('password')}</label>
            <input 
              type="password" 
              required
              className={`w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isRtl ? 'text-right' : 'text-left'}`}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? t('loading') : t('signUp')}
          </button>
        </form>

        <p className="text-center text-gray-500 font-medium">
          {t('hasAccount')} <Link href="/login" className="text-blue-600 font-bold hover:underline">{t('signIn')}</Link>
        </p>
      </div>
    </div>
  );
}
