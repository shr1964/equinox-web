/**
 * Seed/refresh the bilingual `companyPage` documents in Sanity from the
 * codebase content (messages/en.json + messages/ar.json — companyPage.*).
 *
 * Creates two documents with deterministic IDs so re-runs are idempotent:
 *   companyPage-en, companyPage-ar
 *
 * The hero background image asset is NOT touched here — set `heroImage` in the
 * Studio if you want a custom photo; otherwise the page falls back to the
 * bundled /img/ship-aerial.jpg.
 *
 * Usage:
 *   node scripts/seed-company-to-sanity.mjs            # DRY RUN (read-only)
 *   node scripts/seed-company-to-sanity.mjs --commit   # writes (needs SANITY_WRITE_TOKEN)
 *
 * Env (.env.local): NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET
 * (defaults 4jl8bote / production) and, for --commit, SANITY_WRITE_TOKEN (Editor).
 */
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { readFileSync } from "node:fs";

config({ path: ".env.local" });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4jl8bote";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const COMMIT = process.argv.includes("--commit");

const load = (p) =>
  JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const messages = { en: load("messages/en.json"), ar: load("messages/ar.json") };

/** Map a locale's companyPage JSON block to a Sanity `companyPage` document. */
function buildDoc(lang) {
  const c = messages[lang].companyPage;
  const seo = messages[lang].seo?.company ?? {};

  const infoRows = c.legal.rows.map((r, i) => ({
    _type: "infoRow",
    _key: `row-${i + 1}`,
    label: r.k,
    value: r.v,
    order: i + 1,
    format: r.tel ? "tel" : r.mono ? "mono" : "text",
    ...(r.tel ? { tel: r.tel } : {}),
  }));

  return {
    _id: `companyPage-${lang}`,
    language: lang,
    // Hero (navy PageHead)
    heroEyebrow: c.head.eyebrow,
    heroCrumb: c.head.crumb,
    heroTitleLine1: c.head.title1,
    heroTitleLine2: c.head.title2,
    heroSub: c.head.sub,
    heroCtaPrimary: c.head.ctaPrimary,
    heroCtaSecondary: c.head.ctaSecondary,
    // Section header (legal identity)
    sectionEyebrow: c.legal.eyebrow,
    title: c.legal.title,
    description: c.legal.lede,
    // Company information table
    infoRows,
    // SEO
    metaTitle: seo.title,
    metaDescription: seo.description,
    ogTitle: seo.title,
    ogDescription: seo.description,
  };
}

const docs = [buildDoc("en"), buildDoc("ar")];

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: COMMIT ? TOKEN : undefined,
  useCdn: false,
});

console.log(
  `Project ${PROJECT_ID} / ${DATASET} — ${COMMIT ? "COMMIT" : "DRY RUN"}\n`,
);

for (const d of docs) {
  console.log(
    `${d.language}  ${d._id}\n` +
      `      hero  : "${d.heroTitleLine1} ${d.heroTitleLine2 ?? ""}"\n` +
      `      title : "${d.title}"\n` +
      `      rows  : ${d.infoRows.length} (${d.infoRows
        .map((r) => r.label)
        .join(", ")})`,
  );
}

if (!COMMIT) {
  console.log(
    `\nDRY RUN — ${docs.length} companyPage docs would be created/replaced. ` +
      `Re-run with --commit (and SANITY_WRITE_TOKEN set in .env.local) to apply.`,
  );
  process.exit(0);
}
if (!TOKEN) {
  console.error(
    "\n❌ SANITY_WRITE_TOKEN is required for --commit. Add it to .env.local (Editor token).",
  );
  process.exit(1);
}

// createIfNotExists establishes the doc with its deterministic _id; patch().set
// then overwrites only the managed fields. heroImage is never sent, so any photo
// set in the Studio is preserved across re-runs (mirrors Task 1's image-asset rule).
const tx = client.transaction();
for (const { _id, ...fields } of docs) {
  tx.createIfNotExists({ _id, _type: "companyPage", language: fields.language });
  tx.patch(_id, { set: fields });
}
await tx.commit();
console.log(`\n✅ Committed ${docs.length} companyPage docs to ${DATASET}.`);
