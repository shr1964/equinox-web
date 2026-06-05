import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const isSanityConfigured =
  typeof projectId === "string" && /^[a-z0-9-]+$/.test(projectId);

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: process.env.NODE_ENV === "production",
    })
  : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builder = isSanityConfigured ? createImageUrlBuilder(client as any) : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!builder) return { url: () => "" };
  return builder.image(source);
}

export async function sanityFetch<T = unknown>({
  query,
  params = {},
  tags = [] as string[],
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}): Promise<T[]> {
  if (!client) return [];
  return client.fetch<T[]>(query, params, {
    next: {
      revalidate: process.env.NODE_ENV === "development" ? 0 :300,
      tags,
    },
  });
}
