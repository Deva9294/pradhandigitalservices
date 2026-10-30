"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Phone, Mail, Lock, User, ArrowRight, ShieldCheck, 
  Loader2, Store, KeyRound, CheckCircle2, AlertCircle, 
  Eye, EyeOff, Sparkles, MessageSquare 
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth, getRoleRedirect } from "@/contexts/AuthContext";
import BrandLogo from "@/components/ui/BrandLogo";
import { authApi } from "@/lib/api";
import api from "@/lib/api";
import { normalizeIndianMobile, isValidIndianMobile, isValidEmail } from "@/lib/validation";
import { whatsAppUrl } from "@/lib/utils";

type PortalRole = "customer" | "agent" | "admin";
type AuthMode = "password" | "otp";

function LoginContent() {
  const { lang } = useLanguage();
  const { login, isReady: authReady, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected Portal Role: Customer, Agent, Admin
  const [activeRole, setActiveRole] = useState<PortalRole>("customer");
  const [isRegister, setIsRegister] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    shopName: "",
    city: "",
    adminSecret: "",
    otp: ""
  });

  // State Management
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [demoOtpNotice, setDemoOtpNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (authReady && isAuthenticated && user) {
      router.replace(getPostLoginPath(user.role));
    }
  }, [authReady, isAuthenticated, user, router, searchParams]);

  const getPostLoginPath = (role?: string) => {
    const requested = searchParams.get("redirect");
    if (role !== "admin" && role !== "superadmin" && role !== "agent" && role !== "staff" &&
        requested && requested.startsWith("/") && !requested.startsWith("//")) {
      return requested;
    }
    return getRoleRedirect(role);
  };

  // Read URL query params on mount (e.g. ?role=agent or ?action=register)
  useEffect(() => {
    const roleParam = searchParams.get("role")?.toLowerCase();
    if (roleParam === "agent") setActiveRole("agent");
    else if (roleParam === "admin") setActiveRole("admin");
    else if (roleParam === "customer") setActiveRole("customer");

    const actionParam = searchParams.get("action")?.toLowerCase();
    if (actionParam === "register" || roleParam === "register") {
      setIsRegister(true);
    }
  }, [searchParams]);

  // OTP Countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  if (!authReady || (isAuthenticated && user)) {
    return (
      <div className="min-h-screen bg-[#0A1B4D] flex items-center justify-center text-white text-xs">
        {lang === "hi" ? "आपका सुरक्षित सत्र जाँचा जा रहा है..." : "Checking your secure session..."}
      </div>
    );
  }

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError(lang === "hi" ? "कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें" : "Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.sendOtp(cleanPhone);
      if (res.data?.success) {
        setOtpSent(true);
        setOtpCountdown(60);
        setSuccessMsg(res.data.message || "OTP sent successfully!");
        if (res.data.demoOtp) {
          setDemoOtpNotice(`Demo OTP: ${res.data.demoOtp}`);
          setFormData(prev => ({ ...prev, otp: res.data.demoOtp }));
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP. Please try password login.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
    if (!cleanPhone || !formData.otp.trim()) {
      setError("Please enter phone number and 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.verifyOtp(cleanPhone, formData.otp.trim(), formData.name.trim() || undefined);
      if (res.data?.token && res.data?.user) {
        login(res.data.token, res.data.user);
        const redirect = getPostLoginPath(res.data.user.role);
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const identifier = formData.phone.trim() || formData.email.trim();
      if (!identifier || !formData.password) {
        throw new Error(lang === "hi" ? "कृपया मोबाइल/ईमेल और पासवर्ड दर्ज करें" : "Enter phone/email and password");
      }

      const payload = {
        username: identifier,
        password: formData.password,
        role: activeRole // specify targeted portal
      };

      const { data } = await api.post("/auth/login", payload);

      if (!data?.token || !data?.user) {
        throw new Error(data?.message || "Login failed");
      }

      login(data.token, data.user);
      
      // Systematic Redirection based on user's actual confirmed role
      const targetPath = getPostLoginPath(data.user.role);
      router.push(targetPath);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        (lang === "hi" ? "लॉगिन विफल। कृपया विवरण जांचें।" : "Login failed. Please check credentials.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
      if (!cleanPhone || cleanPhone.length !== 10) {
        throw new Error(lang === "hi" ? "वैध 10 अंकों का मोबाइल नंबर आवश्यक है" : "Valid 10-digit phone number is required");
      }

      if (!formData.name.trim()) {
        throw new Error(lang === "hi" ? "कृपया अपना पूरा नाम दर्ज करें" : "Please provide your full name");
      }

      if (formData.password.length < 6) {
        throw new Error(lang === "hi" ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए" : "Password must be at least 6 characters");
      }

      const payload: Record<string, any> = {
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim() || undefined,
        password: formData.password,
        role: activeRole === "agent" ? "agent" : "customer",
        shopName: activeRole === "agent" ? formData.shopName.trim() : undefined,
        city: activeRole === "agent" ? formData.city.trim() : undefined
      };

      const { data } = await api.post("/auth/register", payload);

      if (!data?.token || !data?.user) {
        throw new Error(data?.message || "Registration failed");
      }

      login(data.token, data.user);
      const targetPath = getRoleRedirect(data.user.role);
      router.push(targetPath);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        (lang === "hi" ? "पंजीकरण विफल। कृपया पुनः प्रयास करें।" : "Registration failed. Please try again.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1B4D] via-[#071333] to-[#0A1B4D] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-lg my-8">
        
        {/* Brand Card */}
        <div className="glass-panel rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          
          {/* Top Brand Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block group" title="Pradhan Digital Services">
              <BrandLogo size="lg" tagline="TRUST | DIGITAL | INNOVATION" />
            </Link>
            
            <h1 className="text-xl sm:text-2xl font-black text-white mt-3 tracking-tight">
              {isRegister
                ? (activeRole === "agent" ? "एजेंट / कियोस्क पंजीकरण" : "नागरिक खाता पंजीकरण")
                : (activeRole === "admin" 
                    ? "एडमिनिस्ट्रेटर लॉगिन पोर्टल" 
                    : activeRole === "agent" 
                    ? "एजेंट / कियोस्क संचालक लॉगिन" 
                    : "नागरिक सेवा लॉगिन")}
            </h1>
            <p className="text-xs text-saffron-200/80 mt-1">
              {isRegister
                ? "कुछ ही सेकंड में नया खाता बनाएं और सेवाओं का लाभ लें"
                : "अपने पंजीकृत मोबाइल नंबर या पासवर्ड से लॉगिन करें"}
            </p>
          </div>

          {/* Systematic 3-Role Portal Switcher */}
          {!isRegister && (
            <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-navy-950/80 rounded-2xl border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveRole("customer");
                  setError(null);
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeRole === "customer"
                    ? "bg-saffron-500 text-navy-950 shadow-md"
                    : "text-saffron-200/80 hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>नागरिक (Citizen)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveRole("agent");
                  setError(null);
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeRole === "agent"
                    ? "bg-saffron-500 text-navy-950 shadow-md"
                    : "text-saffron-200/80 hover:text-white"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>एजेंट (Kiosk)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveRole("admin");
                  setError(null);
                  setAuthMode("password"); // admin always uses password
                }}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  activeRole === "admin"
                    ? "bg-saffron-500 text-navy-950 shadow-md"
                    : "text-saffron-200/80 hover:text-white"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>एडमिन (Admin)</span>
              </button>
            </div>
          )}

          {/* Sub-Switch: Password Login vs OTP Instant Login (Available for Customer & Agent) */}
          {!isRegister && activeRole !== "admin" && (
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl border border-white/5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("password");
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                  authMode === "password"
                    ? "bg-white/20 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                पासवर्ड से लॉगिन (Password)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("otp");
                  setError(null);
                }}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                  authMode === "otp"
                    ? "bg-white/20 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3 text-saffron-400" />
                <span>त्वरित OTP लॉगिन (Fast)</span>
              </button>
            </div>
          )}

          {/* Error & Success Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <span>{successMsg}</span>
                {demoOtpNotice && (
                  <div className="font-mono font-bold text-saffron-300 mt-0.5">{demoOtpNotice}</div>
                )}
              </div>
            </div>
          )}

          {/* Form Area */}
          {isRegister ? (
            /* --- REGISTRATION FORM --- */
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-saffron-200/90 mb-1">
                  पूरा नाम (Full Name)*
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="उदा. रमेश कुमार"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-navy-900 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-saffron-200/90 mb-1">
                  10 अंकों का मोबाइल नंबर (WhatsApp Phone)*
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-400" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                    }
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-navy-900 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs"
                  />
                </div>
              </div>

              {activeRole === "agent" && (
                <>
                  <div>
                    <label className="block font-semibold text-saffron-200/90 mb-1">
                      कियोस्क / दुकान का नाम (Shop / Center Name)*
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-400" />
                      <input
                        type="text"
                        required
                        value={formData.shopName}
                        onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                        placeholder="उदा. श्री गणेश ऑनलाइन सेवा केंद्र"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-navy-900 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-saffron-200/90 mb-1">
                      शहर / तहसील / जिला (City / Tehsil)
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="उदा. रेहटी / सीहोर / भोपाल"
                      className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-navy-900 text-white text-xs"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-saffron-200/90 mb-1">
                  ईमेल आईडी (Email ID - Optional)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com (वैकल्पिक)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-navy-900 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-saffron-200/90 mb-1">
                  नया पासवर्ड बनाएं (Create Password)*
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="कम से कम 6 अक्षर"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-white/15 bg-navy-900 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-black rounded-xl transition shadow-lg flex items-center justify-center gap-1.5 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>खाता बनाया जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <span>खाता बनाएं (Create Account)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : authMode === "otp" && activeRole !== "admin" ? (
            /* --- OTP LOGIN FORM --- */
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-saffron-200/90 mb-1">
                  10 अंकों का मोबाइल नंबर (Registered Phone)*
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-400" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                    }
                    placeholder="9876543210"
                    disabled={otpSent}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-navy-900 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs disabled:opacity-70"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block font-semibold text-saffron-200/90 mb-1">
                    6 अंकों का ओटीपी दर्ज करें (Enter 6-digit OTP)*
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-400" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      placeholder="123456"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-navy-900 text-white font-mono tracking-widest text-center text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-white/60">
                    <span>ओटीपी नहीं मिला?</span>
                    {otpCountdown > 0 ? (
                      <span>पुनः भेजें ({otpCountdown}s)</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-saffron-400 font-bold hover:underline"
                      >
                        ओटीपी पुनः भेजें (Resend OTP)
                      </button>
                    )}
                  </div>
                  {demoOtpNotice && (
                    <div className="p-2.5 rounded-xl bg-saffron-500/20 border border-saffron-500/40 text-saffron-300 flex items-center justify-between text-xs mt-2">
                      <span className="font-mono font-bold">🔑 {demoOtpNotice}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const code = demoOtpNotice.replace(/\D/g, "");
                          if (code) setFormData((prev) => ({ ...prev, otp: code }));
                        }}
                        className="px-2.5 py-1 bg-saffron-500 text-navy-950 rounded-lg font-bold hover:bg-saffron-400 transition text-[11px]"
                      >
                        Auto-Fill Code
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-black rounded-xl transition shadow-lg flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>प्रतीक्षा करें...</span>
                  </>
                ) : otpSent ? (
                  <>
                    <span>सत्यापित करें एवं लॉगिन करें</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>ओटीपी भेजें (Send OTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* --- PASSWORD LOGIN FORM --- */
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-saffron-200/90 mb-1">
                  पंजीकृत मोबाइल नंबर या ईमेल (Phone / Email)*
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-400" />
                  <input
                    type="text"
                    required
                    value={formData.phone || formData.email}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d+$/.test(val) || val === "") {
                        setFormData({ ...formData, phone: val, email: "" });
                      } else {
                        setFormData({ ...formData, email: val, phone: "" });
                      }
                    }}
                    placeholder={
                      activeRole === "admin"
                        ? "9294899787 या help@pradhandigitalservices.in"
                        : "10-अंकों का मोबाइल नंबर या ईमेल"
                    }
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/15 bg-navy-900 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-saffron-200/90 mb-1">
                  पासवर्ड (Password)*
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saffron-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="पासवर्ड दर्ज करें"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-white/15 bg-navy-900 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-saffron-500 hover:bg-saffron-400 text-navy-950 font-black rounded-xl transition shadow-lg flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>सत्यापित हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <span>लॉगिन करें (Login)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Toggle between Login and Register */}
          {activeRole !== "admin" && (
            <div className="mt-5 text-center text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-saffron-300 font-bold hover:underline"
              >
                {isRegister
                  ? "पहले से खाता मौजूद है? लॉगिन करें"
                  : activeRole === "agent"
                  ? "नया कियोस्क संचालक एजेंट खाता पंजीकृत करें"
                  : "नया नागरिक खाता बनाएं (Create New Account)"}
              </button>
            </div>
          )}

          {/* Helpdesk link */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
            <Link href="/" className="hover:text-saffron-300 transition">
              ← होम पर वापस
            </Link>
            <a
              href={whatsAppUrl("नमस्ते, मुझे लॉगिन या पंजीकरण में समस्या आ रही है।")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>लॉगिन सहायता</span>
            </a>
          </div>
        </div>

        {/* Security / Statutory badge */}
        <div className="mt-4 text-center text-[11px] text-white/50">
          सुरक्षित 256-बिट एन्क्रिप्शन • Pradhan Digital Services Private Digital Platform
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A1B4D] flex items-center justify-center text-white text-xs">
        Loading portal...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
