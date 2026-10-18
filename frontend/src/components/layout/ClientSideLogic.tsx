"use client";

import { useEffect } from "react";

export default function ClientSideLogic() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return undefined;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration is optional; ignore failures in unsupported environments.
      });
    };

    if (document.readyState === "complete") {
      register();
      return undefined;
    }

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
