import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 overflow-x-hidden">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-6">{title}</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-navy-700 dark:text-navy-300 leading-relaxed">
          {children}
        </div>
        <p className="mt-8 text-xs text-navy-500">
          {siteConfig.name}, {siteConfig.address}. Last updated {siteConfig.currentYear}.
        </p>
      </div>
    </div>
  );
}
