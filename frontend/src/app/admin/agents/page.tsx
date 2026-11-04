"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, ShieldCheck, UserPlus, Store, Phone, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api, { adminApi } from "@/lib/api";

type Agent = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt?: string;
  agentProfile?: { agentCode?: string; shopName?: string; kycStatus?: string };
  agentCode?: string;
};

const initialForm = { name: "", phone: "", email: "", shopName: "", city: "", password: "" };

export default function AdminAgentsPage() {
  const { isReady, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAgents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/users", { params: { role: "agent", limit: 100 } });
      setAgents(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "एजेंट सूची लोड नहीं हो सकी।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated || !isAdmin) {
      router.replace("/login");
      return;
    }
    void loadAgents();
  }, [isReady, isAuthenticated, isAdmin, router, loadAgents]);

  const createAgent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await adminApi.createAgent({
        name: form.name.trim(),
        phone: form.phone.replace(/\D/g, "").slice(-10),
        email: form.email.trim() || undefined,
        shopName: form.shopName.trim(),
        city: form.city.trim() || undefined,
        password: form.password
      });
      const code = response.data?.data?.agentCode;
      setNotice(code ? `एजेंट खाता बन गया। Agent Code: ${code} (KYC pending)` : "एजेंट खाता सफलतापूर्वक बनाया गया।");
      setForm(initialForm);
      await loadAgents();
    } catch (err: any) {
      setError(err?.response?.data?.message || "एजेंट खाता नहीं बन सका।");
    } finally {
      setSaving(false);
    }
  };

  if (!isReady || !isAuthenticated || !isAdmin) {
    return <main className="min-h-screen grid place-items-center text-sm text-slate-600">Checking administrator access…</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0A1B4D] hover:text-[#FF7A00]">
          <ArrowLeft className="h-4 w-4" /> Admin Dashboard
        </Link>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#FF7A00]">Pradhan Digital Services</p>
            <h1 className="mt-1 text-2xl font-black text-[#0A1B4D] sm:text-3xl">Agent Management</h1>
            <p className="mt-1 text-sm text-slate-600">नया कियोस्क एजेंट बनाएं और मौजूदा एजेंट देखें।</p>
          </div>
          <button type="button" onClick={() => void loadAgents()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold shadow-sm hover:border-[#FF7A00]">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {notice && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-[#FF7A00]"><UserPlus className="h-5 w-5" /></div>
            <div><h2 className="font-bold text-[#0A1B4D]">Create Agent Account</h2><p className="text-xs text-slate-500">एजेंट लॉगिन विवरण सुरक्षित रूप से बनाएं।</p></div>
          </div>
          <form onSubmit={createAgent} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm font-semibold">Full name<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-orange-100" placeholder="Agent name" /></label>
            <label className="text-sm font-semibold">Mobile number<input required inputMode="numeric" maxLength={10} value={form.phone} onChange={e => setForm({...form,phone:e.target.value.replace(/\D/g,"").slice(0,10)})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#FF7A00]" placeholder="10-digit mobile" /></label>
            <label className="text-sm font-semibold">Email (optional)<input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#FF7A00]" placeholder="agent@example.com" /></label>
            <label className="text-sm font-semibold">Shop / kiosk name<input required value={form.shopName} onChange={e => setForm({...form,shopName:e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#FF7A00]" placeholder="Digital Seva Kendra" /></label>
            <label className="text-sm font-semibold">City / Tehsil<input value={form.city} onChange={e => setForm({...form,city:e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#FF7A00]" placeholder="City or tehsil" /></label>
            <label className="text-sm font-semibold">Temporary password<input required minLength={8} type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#FF7A00]" placeholder="At least 8 characters" /></label>
            <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">नया एजेंट KYC verification pending स्थिति में बनेगा।</p>
              <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#0A1B4D] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/10 transition hover:bg-[#FF7A00] disabled:cursor-not-allowed disabled:opacity-60">
                <ShieldCheck className="h-4 w-4" /> {saving ? "Creating…" : "Create Agent"}
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div><h2 className="font-bold text-[#0A1B4D]">Registered Agents</h2><p className="text-xs text-slate-500">{agents.length} agents shown</p></div>
            <Store className="h-5 w-5 text-[#FF7A00]" />
          </div>
          {loading ? <div className="p-8 text-center text-sm text-slate-500">Loading agents…</div> : agents.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">अभी कोई एजेंट पंजीकृत नहीं है।</div> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Agent</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Joined</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{agents.map(agent => <tr key={agent._id} className="hover:bg-slate-50/80">
                <td className="px-5 py-4"><p className="font-semibold text-[#0A1B4D]">{agent.name}</p><p className="text-xs text-slate-500">{agent.agentProfile?.agentCode || "Agent account"}{agent.agentProfile?.shopName ? ` · ${agent.agentProfile.shopName}` : ""}</p></td>
                <td className="px-5 py-4"><p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-400" />{agent.phone}</p>{agent.email && <p className="mt-1 flex items-center gap-2 text-xs text-slate-500"><Mail className="h-3.5 w-3.5" />{agent.email}</p>}</td>
                <td className="px-5 py-4"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">Agent</span></td>
                <td className="px-5 py-4 text-xs text-slate-500">{agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "—"}</td>
              </tr>)}</tbody>
            </table></div>
          )}
        </section>
      </div>
    </main>
  );
}
