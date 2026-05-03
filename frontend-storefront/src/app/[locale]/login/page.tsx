"use client";

import { useState, use } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/api";
import { useTranslations } from "next-intl";

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('Auth');
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.post("/auth/token", new URLSearchParams({
        username: formData.email,
        password: formData.password
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const { access_token, user } = response.data;
      login(access_token, user);
      router.push("/products");
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
          <h1 className="text-2xl font-bold pt-4">{t('login')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold text-center">{error}</div>}
          
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
            {loading ? t('loading') : t('signIn')}
          </button>
        </form>

        <p className="text-center text-gray-500 font-medium">
          {t('noAccount')} <Link href="/register" className="text-blue-600 font-bold hover:underline">{t('signUp')}</Link>
        </p>
      </div>
    </div>
  );
}
