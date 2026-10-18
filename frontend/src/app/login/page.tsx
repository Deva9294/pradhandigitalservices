"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, Lock, User, ArrowRight, Shield, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import BrandLogo from "@/components/ui/BrandLogo";
import api from "@/lib/api";
import { normalizeIndianMobile, isValidIndianMobile, isValidEmail } from "@/lib/validation";

export default function LoginPage() {
  const { lang } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    name: "",
  });
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (method === "phone" && !isValidIndianMobile(formData.phone)) {
        throw new Error("Enter a valid 10-digit Indian mobile number");
      }
      if (method === "email" && !isValidEmail(formData.email)) {
        throw new Error("Enter a valid email address");
      }

      const payload =
        method === "phone"
          ? { phone: normalizeIndianMobile(formData.phone), password: formData.password }
          : { email: formData.email.trim(), password: formData.password };

      const { data } = await api.post("/auth/login", payload);

      if (!data?.token || !data?.user) {
        throw new Error(data?.message || "Login failed");
      }

      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!isValidIndianMobile(formData.phone)) {
        throw new Error("Enter a valid 10-digit Indian mobile number");
      }
      if (formData.email.trim() && !isValidEmail(formData.email)) {
        throw new Error("Enter a valid email address");
      }

      const { data } = await api.post("/auth/register", {
        name: formData.name.trim(),
        phone: normalizeIndianMobile(formData.phone),
        email: formData.email.trim() || undefined,
        password: formData.password,
      });

      if (!data?.token || !data?.user) {
        throw new Error(data?.message || "Registration failed");
      }

      login(data.token, data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md">
        <div className="glass-panel rounded-[36px] border border-white/10 shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 rounded-full bg-saffron-500/15 p-4 shadow-xl inline-flex">
              <BrandLogo compact />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isRegister
                ? lang === "hi"
                  ? "खाता बनाएं"
                  : "Create Account"
                : lang === "hi"
                ? "लॉगिन करें"
                : "Login"}
            </h1>
            <p className="text-sm text-saffron-200/90 mt-2">
              {lang === "hi"
                ? "प्रधान डिजिटल सेवाएं में स्वागत है"
                : "Welcome to Pradhan Digital Services"}
            </p>
          </div>

          {!isRegister && (
            <div className="flex gap-2 mb-6 p-1 bg-navy-900/70 rounded-2xl">
              <button
                onClick={() => setMethod("phone")}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition ${
                  method === "phone"
                    ? "bg-saffron-500 text-white shadow"
                    : "text-saffron-200/80"
                }`}
              >
                <Phone className="w-4 h-4 inline mr-1" /> Phone
              </button>
              <button
                onClick={() => setMethod("email")}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition ${
                  method === "email"
                    ? "bg-saffron-500 text-white shadow"
                    : "text-saffron-200/80"
                }`}
              >
                <Mail className="w-4 h-4 inline mr-1" /> Email
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-saffron-500/10 border border-saffron-500/20 rounded-2xl text-sm text-saffron-100">
              {error}
            </div>
          )}

          <form onSubmit={isRegister ? handleRegister : handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-saffron-200/90 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-saffron-300" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-navy-900 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>
            )}

            {method === "phone" || isRegister ? (
              <div>
                <label className="block text-sm font-medium text-saffron-200/90 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-saffron-300" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                    }
                    placeholder="10-digit phone number"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-navy-900 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-saffron-200/90 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-saffron-300" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-navy-900 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>
            )}

            <div>
                <label className="block text-sm font-medium text-saffron-200/90 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-saffron-300" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-navy-900 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : isRegister ? (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                lang === "hi" ? "लॉगिन करें" : "Login"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-sm text-saffron-600 hover:underline"
            >
              {isRegister
                ? lang === "hi"
                  ? "पहले से खाता है? लॉगिन करें"
                  : "Already have an account? Login"
                : lang === "hi"
                ? "नया खाता बनाएं"
                : "Create new account"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-start gap-2 p-4 bg-navy-900/40 rounded-2xl">
              <Shield className="w-4 h-4 text-saffron-300 shrink-0 mt-0.5" />
              <p className="text-xs text-saffron-200/80">
                {lang === "hi"
                  ? "आपका डेटा सुरक्षित है। हम आपकी जानकारी को कभी साझा नहीं करते।"
                  : "Your data is secure. We never share your information with third parties."}
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-saffron-200 hover:text-saffron-400"
            >
              ← {lang === "hi" ? "होम पर वापस" : "Back to Home"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
