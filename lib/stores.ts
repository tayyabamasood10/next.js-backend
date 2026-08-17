import { Store } from "@/types/store";

export function mapStoreRow(data: Record<string, unknown>): Store {
  return {
    id: data.id as string,
    name: data.name as string,
    slug: data.slug as string,
    description: (data.description as string) || "",
    logo: (data.logo_url as string) || "",
    heroTitle: (data.hero_title as string) || "",
    heroDescription: (data.hero_description as string) || "",
    ownerId: data.owner_id as string,
  };
}
