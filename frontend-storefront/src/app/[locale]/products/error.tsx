"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h1 className="text-3xl font-black mb-4">Something went wrong!</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        We encountered an error while loading the products. Please try again later.
      </p>
      <button
        onClick={() => reset()}
        className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-xl active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}
