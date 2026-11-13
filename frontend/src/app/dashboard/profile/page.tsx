"use client";

import { FormEvent, useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type Address = {
  line1?: string; line2?: string; city?: string; state?: string;
  pincode?: string; landmark?: string; isDefault?: boolean;
};

export default function ProfilePage() {
  const { user, token, login, isReady } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [address, setAddress] = useState<Address>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setDateOfBirth((user as any).dateOfBirth ? new Date((user as any).dateOfBirth).toISOString().slice(0, 10) : "");
    setGender((user as any).gender || "");
    setPreferredLanguage((user as any).preferredLanguage || "en");
    setNotificationsEnabled((user as any).notificationsEnabled !== false);
    const addresses = (user as any).addresses as Address[] | undefined;
    setAddress(addresses?.find((item) => item.isDefault) || addresses?.[0] || {});
  }, [user]);

  const setAddressField = (key: keyof Address, value: string) =>
    setAddress((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await api.put("/users/profile", {
        name, email, dateOfBirth: dateOfBirth || null, gender,
        preferredLanguage, notificationsEnabled, address
      });
      const updated = response.data?.user;
      if (!response.data?.success || !updated?.id) throw new Error(response.data?.message || "Profile update failed.");
      login(token || "", { ...user!, ...updated });
      setMessage("Profile successfully update ho gaya.");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Profile update nahi ho paya. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  }

  if (!isReady) return <div className="mx-auto max-w-2xl px-4 py-12 text-center">Loading profile…</div>;
  if (!user) return <div className="mx-auto max-w-2xl px-4 py-12 text-center">Please login to view your profile.</div>;

  const fieldClass = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-600">Account settings</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Apni contact aur personal details update karein.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        {message && <div role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-800">{message}</div>}
        {error && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <section className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700">Full name
            <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={80} required />
          </label>
          <label className="text-sm font-semibold text-slate-700">Mobile number
            <input className={fieldClass} value={user.phone || ""} readOnly />
            <span className="mt-1 block text-xs font-normal text-slate-500">Mobile number change karne ke liye OTP verification zaroori hai.</span>
          </label>
          <label className="text-sm font-semibold text-slate-700">Email address
            <input className={fieldClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} />
          </label>
          <label className="text-sm font-semibold text-slate-700">Date of birth
            <input className={fieldClass} type="date" value={dateOfBirth} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDateOfBirth(e.target.value)} />
          </label>
          <label className="text-sm font-semibold text-slate-700">Gender
            <select className={fieldClass} value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Prefer not to say</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">Preferred language
            <select className={fieldClass} value={preferredLanguage} onChange={(e) => setPreferredLanguage(e.target.value)}>
              <option value="en">English</option><option value="hi">हिन्दी</option>
            </select>
          </label>
        </section>
        <section className="border-t border-slate-100 pt-5">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Address details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Address line 1
              <input className={fieldClass} value={address.line1 || ""} onChange={(e) => setAddressField("line1", e.target.value)} maxLength={120} />
            </label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">Address line 2
              <input className={fieldClass} value={address.line2 || ""} onChange={(e) => setAddressField("line2", e.target.value)} maxLength={120} />
            </label>
            <label className="text-sm font-semibold text-slate-700">City
              <input className={fieldClass} value={address.city || ""} onChange={(e) => setAddressField("city", e.target.value)} maxLength={80} />
            </label>
            <label className="text-sm font-semibold text-slate-700">State
              <input className={fieldClass} value={address.state || ""} onChange={(e) => setAddressField("state", e.target.value)} maxLength={80} />
            </label>
            <label className="text-sm font-semibold text-slate-700">PIN code
              <input className={fieldClass} inputMode="numeric" value={address.pincode || ""} onChange={(e) => setAddressField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} />
            </label>
            <label className="text-sm font-semibold text-slate-700">Landmark
              <input className={fieldClass} value={address.landmark || ""} onChange={(e) => setAddressField("landmark", e.target.value)} maxLength={120} />
            </label>
          </div>
        </section>
        <section className="border-t border-slate-100 pt-5">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
            <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Receive account and service notifications
          </label>
        </section>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="submit" disabled={loading} className="rounded-xl bg-blue-800 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
