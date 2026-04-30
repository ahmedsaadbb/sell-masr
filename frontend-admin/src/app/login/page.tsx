"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import apiClient from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await apiClient.post("/auth/login/access-token", formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      localStorage.setItem("access_token", response.data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 space-y-8 border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-3xl font-bold tracking-tighter mb-2">
            <span className="bg-black text-white px-2 py-1 rounded">Sell</span>
            <span>Masr</span>
          </div>
          <p className="text-gray-500 font-medium">Admin Dashboard Access</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
              placeholder="admin@sellmasr.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <Link href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password"
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center ml-1">
            <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
            <label className="ml-2 text-sm text-gray-600">Remember me for 30 days</label>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Don't have an admin account?{" "}
            <Link href="#" className="text-black font-bold hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>

      {/* Decorative element */}
      <div className="fixed bottom-0 right-0 p-8 opacity-10 select-none pointer-events-none">
        <h1 className="text-[200px] font-black leading-none">ADMIN</h1>
      </div>
    </div>
  );
}
