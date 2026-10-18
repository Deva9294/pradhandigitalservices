import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-saffron-500/15 mb-6">
          <span className="text-5xl font-bold text-saffron-600">404</span>
        </div>
        <h1 className="text-4xl font-bold text-navy-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-navy-600 dark:text-navy-400 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-navy-200 dark:bg-navy-800 text-navy-900 dark:text-white font-semibold rounded-xl hover:bg-navy-300 dark:hover:bg-navy-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
