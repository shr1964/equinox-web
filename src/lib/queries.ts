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
