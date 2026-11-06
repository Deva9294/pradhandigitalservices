import Link from "next/link";

export default function OnlinePaymentPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-[#07132f]">
      <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <p className="text-sm font-bold uppercase tracking-wide text-orange-600">Pradhan Digital Services</p>
        <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">Secure Service Payment</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          भुगतान केवल तब शुरू होगा जब आपकी service application सफलतापूर्वक सेव हो जाएगी।
          सामान्य UPI transfer, wallet top-up, recharge या bill payment इस पेज से स्वीकार नहीं किए जाते,
          क्योंकि उनकी fulfilment integration अभी सक्रिय नहीं है।
        </p>
        <Link href="/services" className="mt-6 inline-flex rounded-xl bg-orange-500 px-5 py-3 font-bold text-white">
          सेवाएँ देखें और आवेदन करें
        </Link>
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          कृपया किसी भी अनजान UPI ID पर भुगतान न करें। आवेदन की payment status अपने dashboard में देखें।
        </p>
      </section>
    </main>
  );
}
