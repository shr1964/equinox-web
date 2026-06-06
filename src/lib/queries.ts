export type NavService = {
  anchor: string;
  title: string;
};

export const navServicesQuery = `
  *[_type == "service" && language == $locale] | order(order asc) {
    "anchor": anchor.current,
    title
  }
`;

export const servicesQuery = `
  *[_type == "service" && language == $locale] | order(order asc) {
    _id,
    "anchor": anchor.current,
    eyebrow,
    title,
    lede,
    bullets,
    "image": image.asset->url,
    imageAlt,
    reverse,
    order
  }
`;

export const homeServicesQuery = `
  *[_type == "service" && language == $locale]
  | order(coalesce(cardOrder, order) asc) {
    _id,
    "anchor":     anchor.current,
    "cardTitle":  coalesce(cardTitle, title),
    "cardDesc":   coalesce(cardDescription, lede),
    "image":      coalesce(cardImage.asset->url, image.asset->url),
    imageAlt,
    "cardOrder":  coalesce(cardOrder, order)
  }
`;

export const serviceBySlugQuery = `
  *[_type == "service" && language == $locale && anchor.current == $slug] | order(order asc) {
    _id,
    "anchor": anchor.current,
    eyebrow,
    title,
    lede,
    bullets,
    "image": image.asset->url,
    imageAlt,
    reverse,
    order
  }
`;

export type CompanyInfoRow = {
  label: string;
  value: string;
  order: number;
  format?: "text" | "mono" | "tel";
  tel?: string;
};

export type CompanyPageData = {
  _id: string;
  language: string;
  heroEyebrow?: string;
  heroCrumb?: string;
  heroTitleLine1: string;
  heroTitleLine2?: string;
  heroSub?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  heroImage?: string | null;
  sectionEyebrow?: string;
  title: string;
  description?: string;
  infoRows?: CompanyInfoRow[];
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
};

export const companyPageQuery = `
  *[_type == "companyPage" && language == $locale] | order(_updatedAt desc) [0...1] {
    _id,
    language,
    heroEyebrow,
    heroCrumb,
    heroTitleLine1,
    heroTitleLine2,
    heroSub,
    heroCtaPrimary,
    heroCtaSecondary,
    "heroImage": heroImage.asset->url,
    sectionEyebrow,
    title,
    description,
    "infoRows": infoRows[] | order(order asc) {
      label,
      value,
      order,
      format,
      tel
    },
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription
  }
`;

export const clientsQuery = `
  *[_type == "client" && language == $locale] | order(order asc) {
    _id,
    num,
    name,
    desc,
    tags,
    market,
    sector,
    order
  }
`;

export const teamMembersQuery = `
  *[_type == "teamMember" && language == $locale] | order(order asc) {
    _id,
    initials,
    tag,
    role,
    name,
    desc,
    phone,
    phoneHref,
    email,
    "image": image.asset->url,
    imageAlt,
    order
  }
`;
