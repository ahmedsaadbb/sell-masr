"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="text-9xl font-black text-gray-100 mb-4">404</div>
      <h1 className="text-4xl font-black mb-4">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        href="/" 
        className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-xl active:scale-95"
      >
        Go Home
      </Link>
    </div>
  );
}
