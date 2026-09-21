"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import { siteConfig } from "@/config/site";

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
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-red-500/15 mb-6">
          <span className="text-5xl font-bold text-red-600">500</span>
        </div>
        <h1 className="text-4xl font-bold text-navy-900 dark:text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-navy-600 dark:text-navy-400 mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-200 dark:bg-navy-800 text-navy-900 dark:text-white font-semibold rounded-xl hover:bg-navy-300 dark:hover:bg-navy-700 transition"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
        <div className="mt-8">
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-saffron-600 hover:text-saffron-700"
          >
            Contact Support on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
