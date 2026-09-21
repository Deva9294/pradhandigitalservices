import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, ArrowLeft, Calendar, MapPin, GraduationCap, Building2, Users, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { sampleVacancies } from "@/data/vacancies";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return sampleVacancies.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vacancy = sampleVacancies.find((v) => v.id === id);
  if (!vacancy) return { title: "Vacancy Not Found" };
  return {
    title: `${vacancy.title} - Apply Online`,
    description: `${vacancy.organization} recruitment for ${vacancy.totalPosts} posts. Last date: ${vacancy.lastDate}`,
    openGraph: { title: `${vacancy.title} | ${siteConfig.name}`, description: `${vacancy.organization} recruitment` },
  };
}

export default async function VacancyDetailPage({ params }: Props) {
  const { id } = await params;
  const vacancy = sampleVacancies.find((v) => v.id === id);
  if (!vacancy) notFound();

  const related = sampleVacancies.filter((v) => v.category === vacancy.category && v.id !== vacancy.id).slice(0, 4);

  const isExpired = new Date(vacancy.lastDate) < new Date();
  const daysRemaining = Math.ceil((new Date(vacancy.lastDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="container mx-auto px-4 py-10">
        <Link href="/vacancies" className="inline-flex items-center gap-1 text-sm text-saffron-600 mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Vacancies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Vacancy Header */}
            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="text-sm text-saffron-600 font-medium">{vacancy.category}</span>
                  <h1 className="text-3xl font-bold text-navy-900 dark:text-white mt-1">{vacancy.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-navy-600 dark:text-navy-400 mt-2">
                    <Building2 className="w-4 h-4" /> {vacancy.organization}
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  isExpired 
                    ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    : daysRemaining <= 7
                    ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                    : "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                }`}>
                  {isExpired ? "Expired" : daysRemaining <= 7 ? `Closing Soon (${daysRemaining} days)` : "Active"}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-navy-600 dark:text-navy-400">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {vacancy.totalPosts.toLocaleString()} Posts</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {vacancy.state}</span>
              </div>
            </div>

            {/* Important Dates */}
            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">Important Dates</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-navy-500 dark:text-navy-400">Application Start Date</div>
                    <div className="font-medium text-navy-900 dark:text-white">{vacancy.postedDate}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-navy-500 dark:text-navy-400">Last Date to Apply</div>
                    <div className="font-medium text-navy-900 dark:text-white">{vacancy.lastDate}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility */}
            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">Eligibility Criteria</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-navy-500 dark:text-navy-400">Qualification</div>
                    <div className="font-medium text-navy-900 dark:text-white">{vacancy.qualification}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-saffron-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-navy-500 dark:text-navy-400">Location</div>
                    <div className="font-medium text-navy-900 dark:text-white">{vacancy.state}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">Required Documents</h2>
              <ul className="space-y-2">
                {["Aadhaar Card", "PAN Card", "10th/12th Marksheet", "Graduation Certificate", "Passport Size Photo", "Signature"].map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm text-navy-700 dark:text-navy-300">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">{siteConfig.disclaimer.en}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href={vacancy.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-saffron-600 text-white font-semibold rounded-xl hover:bg-saffron-500 transition flex items-center gap-2"
              >
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>
              {vacancy.notificationPdf && (
                <a
                  href={vacancy.notificationPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-navy-300 dark:border-navy-600 font-semibold rounded-xl flex items-center gap-2 hover:bg-navy-50 dark:hover:bg-navy-800 transition"
                >
                  <FileText className="w-4 h-4" /> Download Notification
                </a>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <h2 className="font-bold text-navy-900 dark:text-white mb-4">Related Vacancies</h2>
              <div className="space-y-3">
                {related.map((v) => (
                  <Link key={v.id} href={`/vacancies/${v.id}`}
                    className="block p-4 bg-navy-50 dark:bg-navy-900 rounded-xl hover:bg-navy-100 dark:hover:bg-navy-800 transition group">
                    <div className="font-medium text-sm text-navy-900 dark:text-white mb-1">{v.title}</div>
                    <div className="flex items-center gap-2 text-xs text-navy-500">
                      <Building2 className="w-3 h-3" /> {v.organization}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-navy-500 mt-1">
                      <Calendar className="w-3 h-3" /> {v.lastDate}
                    </div>
                  </Link>
                ))}
                {related.length === 0 && (
                  <p className="text-sm text-navy-500 dark:text-navy-400">No related vacancies found.</p>
                )}
              </div>
            </div>

            <div className="p-6 glass-panel rounded-[32px] border border-white/10">
              <h2 className="font-bold text-navy-900 dark:text-white mb-4">Need Help?</h2>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 transition text-center"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
