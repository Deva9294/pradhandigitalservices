"use client";

import { useState } from "react";
import { 
  ShieldCheck, MessageSquare, Phone, AlertCircle, CheckCircle2, 
  Send, UploadCloud, Clock, IndianRupee 
} from "lucide-react";
import { Vacancy } from "@/data/vacancies";
import { vacancyApi } from "@/lib/api";
import { whatsAppUrl } from "@/lib/utils";

interface Props {
  vacancy: Vacancy;
  isExpired: boolean;
}

export default function VacancyAssistanceClient({ vacancy, isExpired }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("UR");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successAppNumber, setSuccessAppNumber] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pdsFee = vacancy.pdsAssistance?.fee || 50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) return;

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg("कृपया अपना नाम और मोबाइल नंबर दर्ज करें।");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const payload = {
        applicantDetails: {
          fullName,
          phone,
          category,
          qualification: vacancy.qualification
        },
        preferredCategory: category,
        notes
      };

      // Call API
      const res = await vacancyApi.applyAssistance(vacancy.id || vacancy.slug, payload);

      if (res.data?.success) {
        setSuccessAppNumber(res.data.applicationNumber || "PDS-REQ-OK");
      } else {
        // Fallback to WhatsApp direct submission if auth token missing or offline
        openWhatsAppIntake();
      }
    } catch (err: any) {
      // In case user is not logged in, gracefully forward to WhatsApp with complete pre-filled details
      openWhatsAppIntake();
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsAppIntake = () => {
    const text = `*प्रणाम प्रधान डिजिटल सर्विसेज*,
मुझे निम्नलिखित भर्ती का ऑनलाइन फॉर्म भरवाना है:
- भर्ती: ${vacancy.title}
- आवेदक: ${fullName || 'उम्मीदवार'}
- मोबाइल: ${phone || '—'}
- श्रेणी: ${category}
- विशेष नोट: ${notes || 'फॉर्म भरने में सहायता प्रदान करें'}

कृपया आवश्यक दस्तावेज और प्रक्रिया बताएं।`;
    window.open(whatsAppUrl(text), "_blank");
    setSuccessAppNumber("PDS-WA-" + Date.now().toString().slice(-4));
  };

  if (isExpired) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-red-500/30 bg-red-950/20 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Application Intake Closed</span>
        </div>
        <p className="text-red-200/80 leading-relaxed">
          इस भर्ती की आधिकारिक आवेदन अंतिम तिथि समाप्त हो चुकी है। PDS सहायता फॉर्म स्वीकार नहीं किए जा रहे हैं।
        </p>
        <div className="pt-2">
          <a
            href={whatsAppUrl(`नमस्ते, मुझे "${vacancy.title}" के आगामी चरण (Admit Card / Result) के बारे में जानकारी चाहिए।`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-saffron-300 hover:underline"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>एडमिट कार्ड / रिजल्ट अपडेट हेतु WhatsApp सहायता</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-saffron-500/30 bg-gradient-to-b from-navy-900 to-navy-950 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-saffron-400" />
          <h3 className="text-base font-bold text-white">PDS सहायता से फॉर्म भरवाएं</h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-saffron-200/70 block">सहायता शुल्क (PDS Fee)</span>
          <span className="text-sm font-extrabold text-emerald-400">₹{pdsFee}</span>
        </div>
      </div>

      <p className="text-xs text-saffron-200/80 leading-relaxed">
        साइबर कैफे या कियोस्क जाने की आवश्यकता नहीं। हमारे विशेषज्ञ ऑपरेटर आपका फॉर्म सही दस्तावेजों और लाइव फोटो वेरिफिकेशन के साथ भरेंगे।
      </p>

      {successAppNumber ? (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-2 text-emerald-200">
          <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>अनुरोध प्राप्त हुआ!</span>
          </div>
          <p>
            आपका संदर्भ क्रमांक: <strong>{successAppNumber}</strong>
          </p>
          <p className="text-[11px] text-emerald-200/80">
            हमारी टीम जल्द ही आपसे WhatsApp / फोन पर संपर्क कर दस्तावेज सत्यापन एवं फॉर्म सबमिशन पूरा करेगी।
          </p>
          <a
            href={whatsAppUrl(`नमस्ते, मेरा संदर्भ क्रमांक ${successAppNumber} है। मैंने ${vacancy.title} के फॉर्म के लिए आवेदन किया है।`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp पर तुरंत चैट करें</span>
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-500/30 text-red-300 text-[11px]">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-saffron-200/90 font-medium mb-1">
              आपका पूरा नाम (Name as in 10th Certificate)*
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-navy-900 text-white placeholder:text-saffron-200/40 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-saffron-200/90 font-medium mb-1">
              व्हाट्सएप मोबाइल नंबर (WhatsApp Number)*
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3 py-2 rounded-xl border border-white/10 bg-navy-900 text-white placeholder:text-saffron-200/40 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-saffron-200/90 font-medium mb-1">
                जाति श्रेणी (Category)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-white/10 bg-navy-900 text-white focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs"
              >
                <option value="UR">General / UR</option>
                <option value="OBC">OBC</option>
                <option value="EWS">EWS</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            <div>
              <label className="block text-saffron-200/90 font-medium mb-1">
                सरकारी परीक्षा शुल्क
              </label>
              <div className="px-2.5 py-2 rounded-xl border border-white/5 bg-navy-900/50 text-white font-bold text-xs truncate">
                {category === "UR" ? `₹${vacancy.feeDetails?.general ?? 0}` : `₹${vacancy.feeDetails?.sc ?? vacancy.feeDetails?.obc ?? 0}`}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-saffron-200/90 font-medium mb-1">
              कोई विशेष निर्देश या प्रश्न (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. रोजगार पंजीयन रिन्यू करना है, आदि"
              className="w-full px-3 py-1.5 rounded-xl border border-white/10 bg-navy-900 text-white placeholder:text-saffron-200/40 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl bg-saffron-600 hover:bg-saffron-500 disabled:opacity-50 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? "कृपया प्रतीक्षा करें..." : "PDS सहायता अनुरोध भेजें"}</span>
          </button>
        </form>
      )}

      <div className="pt-2 border-t border-white/5 text-[10px] text-saffron-200/60 leading-normal">
        * PDS सेवा शुल्क केवल फॉर्म भरने की डिजिटल सहायता हेतु है। सरकारी परीक्षा शुल्क आधिकारिक चालान अनुसार अतिरिक्त देय होगा।
      </div>
    </div>
  );
}
