/**
 * Company page — bilingual (one document per language, `language` = "en" | "ar",
 * matching the service/client/teamMember pattern). Drives /[locale]/company.
 *
 * Field groups:
 *   • hero    — the navy PageHead (breadcrumb, title, sub, CTAs, background image)
 *   • content — the "Legal & corporate identity" section header + the company
 *               information table (label / value / order rows)
 *   • seo     — meta + Open Graph overrides
 *
 * Drafts & preview: every Sanity document supports drafts and the Studio
 * preview pane out of the box, so no extra wiring is needed for publishing.
 */
export default {
  name: "companyPage",
  title: "Company Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
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

    /* ---------- Hero (navy PageHead) ---------- */
    {
      name: "heroEyebrow",
      title: "Hero eyebrow",
      type: "string",
      group: "hero",
      description: "Small label, e.g. 'Corporate Profile · 2026'.",
    },
    {
      name: "heroCrumb",
      title: "Breadcrumb label",
      type: "string",
      group: "hero",
      description: "Final breadcrumb segment, e.g. 'Company Overview'.",
    },
    {
      name: "heroTitleLine1",
      title: "Hero title — line 1",
      type: "string",
      group: "hero",
      validation: (R) => R.required(),
    },
    {
      name: "heroTitleLine2",
      title: "Hero title — line 2",
      type: "string",
      group: "hero",
      description: "Second line of the hero title (rendered after a line break).",
    },
    {
      name: "heroSub",
      title: "Hero sub-text",
      type: "text",
      rows: 3,
      group: "hero",
    },
    {
      name: "heroCtaPrimary",
      title: "Primary CTA label",
      type: "string",
      group: "hero",
    },
    {
      name: "heroCtaSecondary",
      title: "Secondary CTA label",
      type: "string",
      group: "hero",
    },
    {
      name: "heroImage",
      title: "Hero background image",
      type: "image",
      options: { hotspot: true },
      group: "hero",
      description:
        "Background photo for the hero. Falls back to the bundled ship-aerial.jpg if blank.",
    },

    /* ---------- Hero Section (legal identity header) ---------- */
    {
      name: "sectionEyebrow",
      title: "Section eyebrow",
      type: "string",
      group: "content",
      description: "Eyebrow above the section title, e.g. 'Section 01'.",
    },
    {
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description: "Section title, e.g. 'Legal & corporate identity.'",
      validation: (R) => R.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "content",
      description: "Intro paragraph shown under the section title.",
    },

    /* ---------- Company Information Table ---------- */
    {
      name: "infoRows",
      title: "Company information table",
      type: "array",
      group: "content",
      description:
        "Repeatable label / value rows (Company Name, Activity, Legal Form, …).",
      of: [
        {
          type: "object",
          name: "infoRow",
          title: "Row",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              validation: (R) => R.required(),
            },
            {
              name: "value",
              title: "Value",
              type: "string",
              validation: (R) => R.required(),
            },
            {
              name: "order",
              title: "Order",
              type: "number",
              validation: (R) => R.required().integer().min(1),
            },
            {
              name: "format",
              title: "Value format",
              type: "string",
              initialValue: "text",
              options: {
                list: [
                  { title: "Text (bold)", value: "text" },
                  { title: "Monospace (IDs / numbers)", value: "mono" },
                  { title: "Telephone link", value: "tel" },
                ],
                layout: "radio",
              },
            },
            {
              name: "tel",
              title: "Telephone (digits only)",
              type: "string",
              description:
                "Used as the tel: href when format is 'Telephone link', e.g. '+20226210080'.",
              hidden: ({ parent }) => parent?.format !== "tel",
            },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    },

    /* ---------- SEO ---------- */
    {
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      group: "seo",
    },
    {
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 2,
      group: "seo",
    },
    {
      name: "ogTitle",
      title: "Open Graph title",
      type: "string",
      group: "seo",
      description: "Falls back to Meta title if blank.",
    },
    {
      name: "ogDescription",
      title: "Open Graph description",
      type: "text",
      rows: 2,
      group: "seo",
      description: "Falls back to Meta description if blank.",
    },
  ],
  preview: {
    select: { title: "heroTitleLine1", subtitle: "language", media: "heroImage" },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Company Page",
        subtitle: subtitle ? `Company Page · ${subtitle}` : "Company Page",
        media,
      };
    },
  },
};
