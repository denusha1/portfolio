import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";

const BASE_URL = "https://denusha.vercel.app"; // TODO: point at the production domain.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map(project => ({ url: `${BASE_URL}/projects/${project.id}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
