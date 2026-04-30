"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing key if any
  useEffect(() => {
    const fetchKey = async () => {
      try {
        const response = await apiClient.get("/settings/openai_api_key");
        setApiKey(response.data.setting_value || "");
      } catch (e) {
        // ignore 404
      }
    };
    fetchKey();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await apiClient.post("/settings/", {
        setting_key: "openai_api_key",
        setting_value: apiKey,
      });
      setMessage("API key saved successfully.");
      // optionally redirect or stay
    } catch (error: any) {
      setMessage(error.response?.data?.detail || "Failed to save key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-black text-white p-8 space-y-12 shrink-0">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="bg-white text-black px-2 py-1 rounded mr-1">Sell</span>Masr
        </div>
        <nav className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:text-white transition-all">📊 Dashboard</Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 bg-white/10 p-3 rounded-xl font-bold transition-all">🏷️ Products</Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 bg-white/10 p-3 rounded-xl font-bold transition-all">⚙️ Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Settings</h1>
            <p className="text-gray-500">Configure platform-wide settings such as OpenAI API key.</p>
          </div>
          <Link href="/dashboard" className="text-gray-500 font-bold hover:text-black">Back to Dashboard</Link>
        </header>
        <form className="max-w-xl space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">OpenAI API Key</label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
          </div>
          {message && <div className="p-4 bg-green-50 text-green-800 rounded">{message}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </main>
    </div>
  );
}
