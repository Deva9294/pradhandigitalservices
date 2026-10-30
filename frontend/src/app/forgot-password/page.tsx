"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Loader2, Lock, Mail, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { authApi } from "@/lib/api";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (token && password !== confirmPassword) return setError("दोनों पासवर्ड एक जैसे होने चाहिए।");
    if (token && password.length < 8) return setError("नया पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।");
    try {
      setLoading(true);
      const response = token ? await authApi.resetPassword(token, password) : await authApi.requestPasswordReset(email.trim());
      setSuccess(response.data?.message || "आपका अनुरोध प्राप्त हो गया है।");
      if (token) window.setTimeout(() => router.replace("/login"), 1800);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "अभी अनुरोध पूरा नहीं हो सका। कृपया पुनः प्रयास करें।");
    } finally { setLoading(false); }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_rgba(255,122,0,0.18),_transparent_34%),linear-gradient(135deg,#061235_0%,#0A1B4D_52%,#071333_100%)] flex items-center justify-center p-4 sm:p-6 text-white">
      <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-[#FF7A00]/10 blur-3xl" />
      <div className="relative w-full max-w-md">
        <section className="rounded-[2rem] border border-white/15 bg-white/[0.075] p-6 sm:p-9 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex justify-center" aria-label="Pradhan Digital Services home"><BrandLogo size="lg" tagline="TRUST | DIGITAL | INNOVATION" /></Link>
            <div className="mx-auto mt-7 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF7A00]/30 bg-[#FF7A00]/10 text-[#FFB477] shadow-lg">{token ? <Lock className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}</div>
            <h1 className="text-2xl font-black text-white">{token ? "नया पासवर्ड बनाएं" : "पासवर्ड भूल गए?"}</h1>
            <p className="mt-2 text-sm text-blue-100/75">{token ? "अपने खाते के लिए नया सुरक्षित पासवर्ड सेट करें।" : "अपने रजिस्टर्ड ईमेल पर सुरक्षित रीसेट लिंक प्राप्त करें।"}</p>
          </div>
          {error && <div role="alert" className="mb-4 flex gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-200"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
          {success && <div role="status" className="mb-4 flex gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-xs text-emerald-200"><CheckCircle2 className="h-4 w-4 shrink-0" />{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!token ? (
              <div>
                <label htmlFor="reset-email" className="mb-1.5 block text-xs font-bold text-[#FFD0A8]">रजिस्टर्ड ईमेल आईडी (Registered email)</label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FFB477]" /><input id="reset-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" className="w-full rounded-xl border border-white/15 bg-[#071333]/80 py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/30" /></div>
                <p className="mt-2 text-[11px] leading-relaxed text-white/50">यह सुविधा उसी ईमेल के लिए काम करेगी जो आपके खाते में पहले से जुड़ा है।</p>
              </div>
            ) : (
              <>
                <div><label htmlFor="new-password" className="mb-1.5 block text-xs font-bold text-[#FFD0A8]">नया पासवर्ड (New password)</label><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FFB477]" /><input id="new-password" type={showPassword ? "text" : "password"} required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="कम से कम 8 अक्षर" className="w-full rounded-xl border border-white/15 bg-[#071333]/80 py-3 pl-10 pr-11 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/30" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                <div><label htmlFor="confirm-password" className="mb-1.5 block text-xs font-bold text-[#FFD0A8]">पासवर्ड दोबारा दर्ज करें (Confirm password)</label><input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="पासवर्ड दोबारा लिखें" className="w-full rounded-xl border border-white/15 bg-[#071333]/80 px-3 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/30" /></div>
              </>
            )}
            <button type="submit" disabled={loading || Boolean(success && token)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF8A1D] via-[#FF7A00] to-[#F06A00] py-3.5 text-sm font-black text-[#081638] shadow-[0_10px_28px_rgba(255,122,0,0.28)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{token ? "पासवर्ड अपडेट करें" : "रीसेट लिंक भेजें"} <ArrowRight className="h-4 w-4" /></>}</button>
          </form>
          <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-xs"><Link href="/login" className="inline-flex items-center gap-1.5 font-bold text-[#FFB477] transition hover:text-white"><ArrowLeft className="h-3.5 w-3.5" /> लॉगिन पर वापस</Link><span className="inline-flex items-center gap-1 text-white/45"><ShieldCheck className="h-3.5 w-3.5" /> Secure recovery</span></div>
        </section>
        <p className="mt-4 text-center text-[11px] text-white/45">Pradhan Digital Services • TRUST | DIGITAL | INNOVATION</p>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#0A1B4D]" />}><ForgotPasswordContent /></Suspense>;
}