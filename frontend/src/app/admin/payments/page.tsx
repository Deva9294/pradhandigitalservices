"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type Item = { _id: string; paymentId: string; amount: number; status: string; user?: {name?:string;phone?:string}; metadata?: {utr?:string;purpose?:string;verificationStatus?:string}; createdAt:string };

export default function AdminUpiPaymentsPage() {
  const { user } = useAuth();
  const [items,setItems]=useState<Item[]>([]);
  const [filter,setFilter]=useState("submitted");
  const [note,setNote]=useState<Record<string,string>>({});
  const [busy,setBusy]=useState("");
  const [message,setMessage]=useState("");

  async function load(){try{const r=await api.get("/payments/upi/admin",{params:{status:filter}});setItems(r.data.data||[]);}catch(e:any){setMessage(e?.response?.data?.message||"Could not load UPI payments.");}}
  useEffect(()=>{if(user)load();},[user,filter]);
  async function review(id:string,action:"approve"|"reject"){setBusy(id);setMessage("");try{const r=await api.patch("/payments/upi/admin/"+id,{action,note:note[id]||""});setMessage(r.data.message);await load();}catch(e:any){setMessage(e?.response?.data?.message||"Review failed.");}finally{setBusy("");}}
  return <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-[#07132f]"><div className="mx-auto max-w-5xl space-y-5">
    <header><h1 className="text-2xl font-black dark:text-white">UPI Payment Verification</h1><p className="text-sm text-slate-500">Bank statement / merchant app mein actual credit verify karne ke baad hi approve karein.</p></header>
    <div className="flex gap-2"><button onClick={()=>setFilter("submitted")} className={`rounded-lg px-4 py-2 text-sm font-bold ${filter==="submitted"?"bg-orange-500 text-white":"bg-white dark:bg-slate-800"}`}>UTR Submitted</button><button onClick={()=>setFilter("completed")} className={`rounded-lg px-4 py-2 text-sm font-bold ${filter==="completed"?"bg-orange-500 text-white":"bg-white dark:bg-slate-800"}`}>Verified</button><button onClick={()=>setFilter("all")} className={`rounded-lg px-4 py-2 text-sm font-bold ${filter==="all"?"bg-orange-500 text-white":"bg-white dark:bg-slate-800"}`}>All</button></div>
    {message&&<p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">{message}</p>}
    {items.length===0?<p className="rounded-xl bg-white p-6 text-sm dark:bg-slate-900">No matching UPI payments.</p>:items.map(p=><article key={p._id} className="rounded-xl border bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="flex flex-wrap justify-between gap-2"><div><b>{p.paymentId}</b><p className="text-sm text-slate-500">{p.user?.name||"Customer"} · {p.user?.phone||""}</p></div><div className="text-right"><b>₹{p.amount}</b><p className="text-xs">{p.status} / {p.metadata?.verificationStatus}</p></div></div>
      <p className="mt-2 text-sm">UTR: <b className="select-all">{p.metadata?.utr||"Not submitted"}</b></p><p className="text-xs text-slate-500">{p.metadata?.purpose} · {new Date(p.createdAt).toLocaleString("en-IN")}</p>
      {p.status==="pending"&&p.metadata?.utr&&<div className="mt-3 space-y-2"><input value={note[p._id]||""} onChange={e=>setNote(s=>({...s,[p._id]:e.target.value}))} placeholder="Optional admin note" className="w-full rounded-lg border p-2 text-sm dark:bg-slate-800"/><div className="flex gap-2"><button disabled={!!busy} onClick={()=>review(p._id,"approve")} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busy===p._id?"Saving...":"Approve after bank check"}</button><button disabled={!!busy} onClick={()=>review(p._id,"reject")} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Reject</button></div></div>}
    </article>)}
  </div></main>;
}
