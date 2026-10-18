"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function WalletPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-4">Wallet</h1>
      <p className="text-navy-600 dark:text-navy-300 mb-6">
        Current balance: ₹{(user?.walletBalance ?? 0).toFixed(0)}
      </p>
      <Link href="/contact" className="inline-block px-5 py-3 bg-saffron-600 text-white rounded-xl font-semibold">
        Contact support to add money
      </Link>
    </div>
  );
}
