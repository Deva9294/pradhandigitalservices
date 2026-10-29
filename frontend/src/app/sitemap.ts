import type { MetadataRoute } from "next";
import { allServices } from "@/data/services";

const BASE_URL = "https://pradhan-frontend-4g39.onrender.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: currentDate, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/services`, lastModified: currentDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/vacancies`, lastModified: currentDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/admit-cards`, lastModified: currentDate, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/results`, lastModified: currentDate, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/government-schemes`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/offline-forms`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/document-tools`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/recharge`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/track-application`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
  ];

  const servicePages: MetadataRoute.Sitemap = allServices.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages];
}
