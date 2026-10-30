"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { API_ORIGIN } from "@/lib/utils";

export default function LiveVisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    let sessionId = "";
    try {
      sessionId = window.localStorage.getItem("pds_visitor_session") || "";
      if (!sessionId) {
        sessionId = window.crypto?.randomUUID?.() || `pds_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        window.localStorage.setItem("pds_visitor_session", sessionId);
      }
    } catch {
      sessionId = `pds_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    }

    const base = API_ORIGIN.replace(/\/$/, "");
    const sendHeartbeat = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        await fetch(`${base}/api/visitors/heartbeat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
          cache: "no-store",
          keepalive: true,
        });
      } catch {
        // Analytics is optional; never interrupt the visitor's browsing.
      }
    };

    const refreshCount = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch(`${base}/api/visitors/live`, { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (active && Number.isFinite(data.liveVisitors)) setCount(data.liveVisitors);
      } catch {
        // Keep the last known count if the analytics endpoint is temporarily unavailable.
      }
    };

    const refresh = () => {
      if (document.visibilityState === "visible") {
        void sendHeartbeat();
        void refreshCount();
      }
    };

    refresh();
    const heartbeatTimer = window.setInterval(sendHeartbeat, 30000);
    const countTimer = window.setInterval(refreshCount, 10000);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      active = false;
      window.clearInterval(heartbeatTimer);
      window.clearInterval(countTimer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return (
    <div
      className="fixed bottom-24 left-3 z-40 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur dark:border-emerald-500/20 dark:bg-slate-900/90 dark:text-slate-100"
      aria-live="polite"
      title="Visitors active in the last 90 seconds; refreshed every 10 seconds"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <Users className="h-3.5 w-3.5 text-emerald-600" />
      <span>{count === null ? "Live visitors…" : `${count} live visitors`}</span>
    </div>
  );
}
