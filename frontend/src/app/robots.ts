import type { MetadataRoute } from "next";

const BASE_URL = "https://pradhan-frontend-4g39.onrender.com";

export default function robots(): MetadataRoute.Robots {
return {
rules: {
userAgent: "*",
allow: "/",
disallow: ["/admin/", "/dashboard/", "/agent/"],
},
sitemap: "${BASE_URL}/sitemap.xml",
};
}
