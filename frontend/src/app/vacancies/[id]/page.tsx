import { redirect } from "next/navigation";
import { sampleVacancies } from "@/data/vacancies";

export async function generateStaticParams() {
  return sampleVacancies.map((v) => ({ id: v.slug || v.id }));
}

export default async function VacancyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/vacancy-update/${id}`);
}
