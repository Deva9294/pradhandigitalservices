import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { 
  Building2, Users, Calendar, MapPin, GraduationCap, ShieldCheck, 
  ExternalLink, FileText, CheckCircle2, AlertCircle, ArrowLeft, 
  Clock, IndianRupee, Download, HelpCircle, Phone, MessageSquare, 
  ChevronRight, AlertTriangle, Info, Check, ArrowUpRight
} from "lucide-react";
import { sampleVacancies, Vacancy } from "@/data/vacancies";
import { siteConfig } from "@/config/site";
import { whatsAppUrl, telSupportUrl } from "@/lib/utils";
import VacancyAssistanceClient from "./VacancyAssistanceClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return sampleVacancies.map((v) => ({
    slug: v.slug || v.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = sampleVacancies.find((v) => v.slug === slug || v.id === slug);

  if (!vacancy) return { title: "Vacancy Not Found | Pradhan Digital Services" };

  return {
    title: `${vacancy.title} - Eligibility, Dates & Form | ${siteConfig.name}`,
    description: `${vacancy.organization} recruitment for ${vacancy.totalPosts} posts. Eligibility: ${vacancy.qualification}. Application last date: ${vacancy.lastDate}. Apply online or get PDS assistance.`,
    openGraph: {
      title: `${vacancy.title} | ${siteConfig.name}`,
      description: `Official recruitment update for ${vacancy.totalPosts} posts by ${vacancy.organization}.`,
      url: `https://pradhandigitalservices.in/vacancy-update/${slug}`
    }
  };
}

export default async function VacancyDetailPage({ params }: Props) {
  const { slug } = await params;
  const vacancy = sampleVacancies.find((v) => v.slug === slug || v.id === slug);

  if (!vacancy) notFound();

  const now = new Date();
  const lastDateObj = vacancy.lastDate ? new Date(vacancy.lastDate) : null;
  const isExpired = lastDateObj ? now > lastDateObj : false;
  const daysRemaining = lastDateObj 
    ? Math.ceil((lastDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Breadcrumb Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-navy-900 to-navy-950 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs text-saffron-300 mb-3">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/vacancy-update" className="hover:underline">Vacancy Update</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60 truncate max-w-xs">{vacancy.recruitingAuthority || vacancy.department}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {vacancy.recruitingAuthority && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                    {vacancy.recruitingAuthority}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-saffron-500/20 text-saffron-300 font-medium border border-saffron-500/30">
                  {vacancy.locationScope === "MP" ? "मध्य प्रदेश (MP Domicile)" : "All India (All States)"}
                </span>
                {vacancy.applicationMode && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                    Mode: {vacancy.applicationMode.toUpperCase()}
                  </span>
                )}
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                  isExpired 
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : daysRemaining !== null && daysRemaining <= 7
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}>
                  {isExpired 
                    ? "Application Closed" 
                    : daysRemaining !== null && daysRemaining <= 7
                    ? `Closing Soon (${daysRemaining} Days Left)`
                    : "Active Application"}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {vacancy.title}
              </h1>
              {vacancy.titleHi && (
                <p className="text-saffron-200/90 text-sm md:text-base font-medium">
                  {vacancy.titleHi}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-saffron-200/80 pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-saffron-400" />
                  {vacancy.department}
                </span>
                {vacancy.advertisementNumber && (
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-saffron-400" />
                    Advt No: {vacancy.advertisementNumber}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-saffron-400" />
                  Total Posts: <strong>{vacancy.totalPosts.toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Quick Contact Desk */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={whatsAppUrl(`नमस्ते, मुझे "${vacancy.title}" के संबंध में जानकारी व फॉर्म भरने में सहायता चाहिए।`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>
              <a
                href={telSupportUrl()}
                className="px-3.5 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2-Column Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overview Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Info className="w-5 h-5 text-saffron-400" />
                <span>Recruitment Overview & Summary (संक्षिप्त विवरण)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 space-y-1">
                  <div className="text-saffron-300 font-medium">Recruiting Authority</div>
                  <div className="font-bold text-white text-sm">{vacancy.recruitingAuthority || vacancy.organization}</div>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 space-y-1">
                  <div className="text-saffron-300 font-medium">Employing Department</div>
                  <div className="font-bold text-white text-sm">{vacancy.department}</div>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 space-y-1">
                  <div className="text-saffron-300 font-medium">Total Vacancies</div>
                  <div className="font-bold text-emerald-400 text-base">{vacancy.totalPosts.toLocaleString()} Posts</div>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 space-y-1">
                  <div className="text-saffron-300 font-medium">Pay Scale / Salary</div>
                  <div className="font-bold text-white text-sm">{vacancy.salary || "As per official notification"}</div>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 space-y-1">
                  <div className="text-saffron-300 font-medium">Location Scope</div>
                  <div className="font-bold text-white text-sm">{vacancy.locationScope === "MP" ? "Madhya Pradesh (State Govt)" : "All India (Central)"}</div>
                </div>
                <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 space-y-1">
                  <div className="text-saffron-300 font-medium">Application Mode</div>
                  <div className="font-bold text-white text-sm uppercase">{vacancy.applicationMode || "Online"}</div>
                </div>
              </div>
            </div>

            {/* Important Dates (Exact IST Deadlines) */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Calendar className="w-5 h-5 text-saffron-400" />
                <span>Important Dates (महत्वपूर्ण तिथियां - IST)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <span className="text-saffron-200/80">Application Opening Date:</span>
                  <span className="font-bold text-white">{vacancy.startDate || "Officially announced"}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <span className="text-saffron-200/80">Application Deadline (अंतिम तिथि):</span>
                  <span className="font-bold text-amber-300 text-sm">{vacancy.lastDate}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <span className="text-saffron-200/80">Fee Payment Last Date:</span>
                  <span className="font-bold text-white">{vacancy.feeLastDate || vacancy.lastDate}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <span className="text-saffron-200/80">Correction Window:</span>
                  <span className="font-bold text-white">
                    {vacancy.correctionDate ? `${vacancy.correctionDate} to ${vacancy.correctionEndDate || ""}` : "Not Announced / As per notice"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <span className="text-saffron-200/80">Exam Date (परीक्षा तिथि):</span>
                  <span className="font-bold text-white">{vacancy.examDate || "Tentative / To be notified"}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-navy-900/50 border border-white/5">
                  <span className="text-saffron-200/80">Admit Card Release:</span>
                  <span className="font-bold text-white">{vacancy.admitCardDate || "7-10 Days before Exam"}</span>
                </div>
              </div>
            </div>

            {/* Post-wise Breakdown (if available) */}
            {vacancy.category && (
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <GraduationCap className="w-5 h-5 text-saffron-400" />
                  <span>Eligibility & Age Criteria (पात्रता एवं आयु सीमा)</span>
                </h2>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div className="p-3.5 rounded-xl bg-navy-900/60 border border-white/5">
                    <span className="text-saffron-300 font-bold block mb-1">Educational Qualification (शैक्षणिक योग्यता):</span>
                    <p className="text-white text-sm font-medium">{vacancy.qualification}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5">
                      <span className="text-saffron-300 font-semibold block mb-0.5">Age Limits (आयु सीमा):</span>
                      <span className="text-white font-bold">{vacancy.ageMinimum || 18} to {vacancy.ageMaximum || 40} Years</span>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5">
                      <span className="text-saffron-300 font-semibold block mb-0.5">Age Relaxations:</span>
                      <span className="text-white">{vacancy.ageRelaxation || "As per MP/Central Government reservation norms"}</span>
                    </div>
                  </div>

                  {vacancy.domicileRequirement && (
                    <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5">
                      <span className="text-saffron-300 font-semibold block mb-0.5">Domicile & Registration Rules (मूल निवास / पंजीयन):</span>
                      <span className="text-white">{vacancy.domicileRequirement}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Official Fee Structure */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <IndianRupee className="w-5 h-5 text-saffron-400" />
                <span>Official Government Fee (आधिकारिक परीक्षा शुल्क)</span>
              </h2>

              {vacancy.feeDetails ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 text-center">
                      <span className="text-saffron-300 block mb-1">General / UR</span>
                      <span className="text-white font-bold text-sm">₹{vacancy.feeDetails.general ?? "—"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 text-center">
                      <span className="text-saffron-300 block mb-1">OBC / EWS</span>
                      <span className="text-white font-bold text-sm">₹{vacancy.feeDetails.obc ?? vacancy.feeDetails.general ?? "—"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 text-center">
                      <span className="text-saffron-300 block mb-1">SC / ST (MP)</span>
                      <span className="text-white font-bold text-sm">₹{vacancy.feeDetails.sc ?? "0"}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 text-center">
                      <span className="text-saffron-300 block mb-1">Female / Divyang</span>
                      <span className="text-white font-bold text-sm">₹{vacancy.feeDetails.female ?? "0"}</span>
                    </div>
                  </div>

                  {vacancy.feeDetails.portalCharges ? (
                    <div className="p-2.5 rounded-lg bg-white/5 text-[11px] text-saffron-200/80">
                      * Official Portal / Kiosk charge: ₹{vacancy.feeDetails.portalCharges} extra as applicable.
                    </div>
                  ) : null}

                  {vacancy.feeDetails.note && (
                    <p className="text-[11px] text-saffron-200/90 italic">
                      Note: {vacancy.feeDetails.note}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-saffron-200/80">Refer to official advertisement for exact fee category details.</p>
              )}
            </div>

            {/* Document Checklist (Vacancy-Specific) */}
            {vacancy.documentChecklist && vacancy.documentChecklist.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Vacancy Document Checklist (आवश्यक दस्तावेज़ सूची)</span>
                </h2>

                <div className="space-y-2.5">
                  {vacancy.documentChecklist.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-navy-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{doc.documentName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            doc.requirementType === 'mandatory'
                              ? 'bg-red-500/20 text-red-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {doc.requirementType}
                          </span>
                        </div>
                        {doc.documentNameHi && (
                          <div className="text-saffron-200/80 text-[11px]">{doc.documentNameHi}</div>
                        )}
                        {doc.notificationReference && (
                          <div className="text-saffron-300/60 text-[10px]">{doc.notificationReference}</div>
                        )}
                      </div>

                      <div className="text-right text-[11px] text-saffron-200/70 shrink-0">
                        <div>Stage: <strong className="text-white capitalize">{doc.stage.replace('_', ' ')}</strong></div>
                        {doc.allowedFormats && (
                          <div>Format: {doc.allowedFormats.join(', ')} {doc.maxSizeKB ? `(Max ${doc.maxSizeKB}KB)` : ''}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Process Stages */}
            {vacancy.selectionProcess && vacancy.selectionProcess.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <Users className="w-5 h-5 text-saffron-400" />
                  <span>Selection Stages (चयन प्रक्रिया)</span>
                </h2>

                <div className="space-y-3">
                  {vacancy.selectionProcess.map((stage) => (
                    <div key={stage.stageNumber} className="flex items-start gap-3 text-xs">
                      <div className="w-6 h-6 rounded-full bg-saffron-500 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                        {stage.stageNumber}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-white text-sm">
                          {stage.title} {stage.titleHi ? `(${stage.titleHi})` : ''}
                        </div>
                        <p className="text-saffron-200/80 leading-relaxed">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offline Form Details (if offline) */}
            {vacancy.offlineFormDetails && (
              <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <Download className="w-5 h-5 text-purple-400" />
                  <span>Offline Form Submission Details (ऑफलाइन आवेदन प्रारूप)</span>
                </h2>

                <div className="space-y-3 text-xs">
                  {vacancy.offlineFormDetails.formPdfUrl && (
                    <div>
                      <a
                        href={vacancy.offlineFormDetails.formPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Official Application Form PDF</span>
                      </a>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 space-y-1">
                    <span className="text-saffron-300 font-semibold block">Submission Address (फॉर्म जमा करने का पता):</span>
                    <p className="text-white">{vacancy.offlineFormDetails.submissionAddress}</p>
                    <span className="text-[11px] text-saffron-200/70">
                      * Deadline Type: Submission is counted on {vacancy.offlineFormDetails.deadlineType === 'receipt' ? 'Receipt at office' : 'Dispatch date'}.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Direct Links & PDS Form Submission */}
          <div className="space-y-6">
            
            {/* Direct Official Links Box */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                <ExternalLink className="w-4 h-4 text-saffron-400" />
                <span>Official Direct Links (आधिकारिक लिंक)</span>
              </h3>

              <div className="space-y-2 text-xs">
                {vacancy.applyUrl || vacancy.applyLink ? (
                  <a
                    href={vacancy.applyUrl || vacancy.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-bold transition shadow"
                  >
                    <span>Official Online Apply Portal</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : null}

                {vacancy.notificationPdf && (
                  <a
                    href={vacancy.notificationPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-navy-900/80 hover:bg-white/10 border border-white/10 text-white font-semibold transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-saffron-400" />
                      Official Notification PDF
                    </span>
                    <Download className="w-4 h-4 text-saffron-300" />
                  </a>
                )}

                {vacancy.officialWebsiteUrl && (
                  <a
                    href={vacancy.officialWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-navy-900/80 hover:bg-white/10 border border-white/10 text-white font-medium transition"
                  >
                    <span>Official Authority Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-saffron-300" />
                  </a>
                )}

                {vacancy.syllabusUrl && (
                  <a
                    href={vacancy.syllabusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-navy-900/80 hover:bg-white/10 border border-white/10 text-white font-medium transition"
                  >
                    <span>Exam Syllabus & Scheme PDF</span>
                    <Download className="w-3.5 h-3.5 text-saffron-300" />
                  </a>
                )}

                {vacancy.admitCardUrl && (
                  <a
                    href={vacancy.admitCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold transition"
                  >
                    <span>Download Admit Card / Hall Ticket</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}

                {vacancy.resultUrl && (
                  <a
                    href={vacancy.resultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold transition"
                  >
                    <span>View Result / Merit List</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* PDS Form Filing Assistance Box (Interactive Client Component) */}
            <VacancyAssistanceClient vacancy={vacancy} isExpired={isExpired} />

            {/* Customer Helpline Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-gradient-to-b from-navy-900/90 to-navy-950 space-y-3 text-xs">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-saffron-400" />
                <span>Need Assistance or Form Filing Help?</span>
              </h4>
              <p className="text-saffron-200/80 leading-relaxed text-[11px]">
                Facing issues with MP Rojgar Panjiyan, photo-signature resizing, live camera photo capture, or online payment failure? Contact Pradhan Digital Services support.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={whatsAppUrl(`नमस्ते, मुझे "${vacancy.title}" के बारे में फॉर्म भरने में सहायता चाहिए।`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp: +91 9294899787</span>
                </a>
                <a
                  href={telSupportUrl()}
                  className="px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-white/10 text-white font-semibold flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-saffron-400" />
                  <span>Call: +91 9294899787</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory PDS Statutory Disclaimer */}
        <div className="mt-12 p-5 rounded-2xl bg-navy-900/90 border border-saffron-500/20 text-xs text-saffron-200/80 leading-relaxed shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-saffron-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-1">
                Statutory Disclaimer (वैधानिक अस्वीकरण):
              </p>
              <p>
                “Pradhan Digital Services is a private digital assistance platform. Government services are processed through official portals and applicable government rules. We are not a government department.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
