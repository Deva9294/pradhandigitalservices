"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-4">Profile</h1>
      <div className="rounded-2xl bg-white dark:bg-navy-800 p-6 space-y-2">
        <p><strong>Name:</strong> {user?.name || "Guest"}</p>
        <p><strong>Phone:</strong> {user?.phone || "-"}</p>
        <p><strong>Email:</strong> {user?.email || "-"}</p>
        <p><strong>Role:</strong> {user?.role || "customer"}</p>
      </div>
    </div>
  );
}
