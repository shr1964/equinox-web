export default {
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Full name",
      type: "string",
      validation: (R) => R.required(),
    },
    {
      name: "initials",
      title: "Initials",
      type: "string",
      description: "2-3 letter initials shown on the avatar card, e.g. 'HE'",
      validation: (R) => R.required().max(3),
    },
    {
      name: "tag",
      title: "Department tag",
      type: "string",
      description: "Small label on the avatar, e.g. 'Executive Director'",
    },
    {
      name: "role",
      title: "Job title",
      type: "string",
      validation: (R) => R.required(),
    },
    {
      name: "desc",
      title: "Bio",
      type: "text",
      rows: 3,
    },
    {
      name: "phone",
      title: "Phone (display)",
      type: "string",
      description: "Formatted display number, e.g. '+20 122 215 1756'",
    },
    {
      name: "phoneHref",
      title: "Phone (href)",
      type: "string",
      description: "Digits only for tel: link, e.g. '+201222151756'",
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (R) => R.email(),
    },
    {
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "imageAlt",
      title: "Photo alt text",
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
    select: { title: "name", subtitle: "role", media: "image" },
  },
};
