export default {
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Company name",
      type: "string",
      validation: (R) => R.required(),
    },
    {
      name: "num",
      title: "Card label",
      type: "string",
      description: "Display label for the portfolio card, e.g. '01 / Telecoms'",
    },
    {
      name: "desc",
      title: "Engagement description",
      type: "text",
      rows: 3,
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Market or category tags, e.g. 'Egypt', 'UAE'",
    },
    {
      name: "market",
      title: "Market(s)",
      type: "string",
      description: "e.g. 'Egypt · UAE'",
    },
    {
      name: "sector",
      title: "Industry sector",
      type: "string",
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
    select: { title: "name", subtitle: "market" },
  },
};
