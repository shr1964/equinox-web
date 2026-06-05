export interface LogoClient {
  id: string;
  name: string;
  logo: string;
  category: string;
  country: string;
  logoScale?: number;
}

export const CLIENT_LOGOS: LogoClient[] = [
  {
    id: "vodafone",
    name: "Vodafone Egypt",
    logo: "/real-logo/Vodafone-eg.jpg",
    category: "Telecommunications",
    country: "Egypt",
  },
  {
    id: "nec",
    name: "NEC",
    logo: "/real-logo/nec.png",
    category: "Technology",
    country: "Egypt",
  },
  {
    id: "el-sewedy",
    name: "El Sewedy Digital",
    logo: "/real-logo/El-Sewedy.png",
    category: "Technology",
    country: "Egypt",
  },
  {
    id: "benya",
    name: "Benya Capital Misr",
    logo: "/real-logo/Benya-Capital-Misr.png",
    category: "Technology",
    country: "Egypt",
  },
  {
    id: "westcon",
    name: "Westcon Comstor",
    logo: "/real-logo/Westcon.avif",
    category: "Distribution",
    country: "UAE",
  },
  {
    id: "hoist",
    name: "Hoist Group",
    logo: "/real-logo/Hoist-Group.png",
    category: "Technology",
    country: "UAE",
  },
  {
    id: "oasis",
    name: "Oasis Distribution",
    logo: "/real-logo/Oasis-Distribution.jpg",
    category: "Distribution",
    country: "Egypt",
    logoScale: 1.35,
  },
  {
    id: "kqtel",
    name: "KQTEL Ventures",
    logo: "/real-logo/kqtel.jpg",
    category: "Ventures",
    country: "UAE",
  },
  {
    id: "infrateq",
    name: "Infrateq Network Group",
    logo: "/real-logo/infrateq.png",
    category: "Networking",
    country: "UAE",
    logoScale: 1.4,
  },
  {
    id: "egypt-soft",
    name: "Egypt Soft Commerce",
    logo: "/real-logo/egypt-soft.jpg",
    category: "Commerce",
    country: "Egypt",
    logoScale: 1.35,
  },
];

function matchClient(clientName: string): LogoClient | null {
  const lower = clientName.toLowerCase();
  for (const client of CLIENT_LOGOS) {
    const key = client.id.replace(/-/g, " ");
    if (lower.includes(key) || lower.includes(client.id)) return client;
  }
  return null;
}

export function findClientLogo(clientName: string): string | null {
  return matchClient(clientName)?.logo ?? null;
}

export function findClientScale(clientName: string): number {
  return matchClient(clientName)?.logoScale ?? 1;
}

export function findClientLogoById(id: string): string | null {
  return CLIENT_LOGOS.find((c) => c.id === id)?.logo ?? null;
}

export function findClientScaleById(id: string): number {
  return CLIENT_LOGOS.find((c) => c.id === id)?.logoScale ?? 1;
}
