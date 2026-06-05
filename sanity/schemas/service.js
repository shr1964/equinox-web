export default {
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (R) => R.required(),
    },
    {
      name: "anchor",
      title: "Anchor / Slug",
      type: "slug",
      description: "URL slug used for routing — e.g. 'ior', 'freight-forwarding'. Also used as the anchor on the Services page.",
      options: { source: "title", maxLength: 64 },
      validation: (R) => R.required(),
    },
    {
      name: "cardTitle",
      title: "Card title",
      type: "string",
      description: "Short title shown on the home page card (e.g. 'IOR / EOR Services'). Falls back to the main Title if blank.",
    },
    {
      name: "cardDescription",
      title: "Card description",
      type: "text",
      rows: 2,
      description: "Marketing copy shown on the home page card (≤ 120 chars). Falls back to the main Description if blank.",
    },
    {
      name: "cardImage",
      title: "Card image (optional)",
      type: "image",
      options: { hotspot: true },
      description: "Separate image for the home page card. Falls back to the main Image if blank.",
    },
    {
      name: "cardOrder",
      title: "Card order",
      type: "number",
      description: "Override display order on the home page. Falls back to the main Display Order if blank.",
    },
    {
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Small label above the title, e.g. '01 · Import Agency'",
    },
    {
      name: "lede",
      title: "Description",
      type: "text",
      rows: 3,
    },
    {
      name: "bullets",
      title: "Feature bullets",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "imageAlt",
      title: "Image alt text",
      type: "string",
    },
    {
      name: "reverse",
      title: "Reverse layout",
      type: "boolean",
      description: "Place the image on the right side",
      initialValue: false,
    },
    {
      name: "order",
      title: "Display order",
      type: "number",
      validation: (R) => R.required().integer().min(1),
    },
    {
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Arabic", value: "ar" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    },
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "language", media: "image" },
  },
};
