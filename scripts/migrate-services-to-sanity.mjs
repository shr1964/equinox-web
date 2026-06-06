/**
 * Migration: sync Sanity `service` documents to the codebase content
 * (messages/en.json + messages/ar.json — the post-refactor source of truth).
 *
 * Each Sanity doc is matched to a codebase section by (language, order), then
 * these fields are overwritten:
 *   anchor (slug), eyebrow, title, lede, bullets, reverse, imageAlt,
 *   cardTitle, cardDescription.
 * Image ASSETS are never touched (the uploaded Sanity images are preserved).
 *
 * Usage:
 *   node scripts/migrate-services-to-sanity.mjs            # DRY RUN (read-only, no token)
 *   node scripts/migrate-services-to-sanity.mjs --commit   # writes (needs SANITY_WRITE_TOKEN)
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

const load = (p) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), "utf8"));
const messages = { en: load("messages/en.json"), ar: load("messages/ar.json") };

function buildByOrder(msgs) {
  const homeByAnchor = Object.fromEntries(
    msgs.home.services.items.map((h) => [h.anchor, h]),
  );
  const byOrder = {};
  msgs.servicesPage.sections.forEach((sec, i) => {
    const h = homeByAnchor[sec.anchor] || {};
    byOrder[i + 1] = {
      anchor: sec.anchor,
      eyebrow: sec.eyebrow,
      title: sec.title,
      lede: sec.lede,
      bullets: sec.bullets,
      reverse: !!sec.reverse,
      imageAlt: sec.imageAlt,
      cardTitle: [h.title1, h.title2].filter(Boolean).join(" ") || undefined,
      cardDescription: h.desc || undefined,
    };
  });
  return byOrder;
}
const byOrder = { en: buildByOrder(messages.en), ar: buildByOrder(messages.ar) };

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token: COMMIT ? TOKEN : undefined,
  useCdn: false,
});

console.log(`Project ${PROJECT_ID} / ${DATASET} — ${COMMIT ? "COMMIT" : "DRY RUN"}\n`);

const docs = await client.fetch(
  `*[_type=="service"]{_id, language, order, "anchor": anchor.current, title}`,
);

// Guard: each (language, order) must be unique so the join is unambiguous.
const seen = new Set();
for (const d of docs) {
  const k = `${d.language}#${d.order}`;
  if (seen.has(k)) {
    console.error(`❌ Duplicate (language, order) = ${k}. Aborting — resolve manually.`);
    process.exit(1);
  }
  seen.add(k);
}

const tx = client.transaction();
let n = 0;
for (const d of docs.sort((a, b) => a.language.localeCompare(b.language) || a.order - b.order)) {
  const target = byOrder[d.language]?.[d.order];
  if (!target) {
    console.log(`⏭  skip ${d.language} #${d.order} (no codebase section)`);
    continue;
  }
  const set = {
    anchor: { _type: "slug", current: target.anchor },
    eyebrow: target.eyebrow,
    title: target.title,
    lede: target.lede,
    bullets: target.bullets,
    reverse: target.reverse,
    imageAlt: target.imageAlt,
    ...(target.cardTitle ? { cardTitle: target.cardTitle } : {}),
    ...(target.cardDescription ? { cardDescription: target.cardDescription } : {}),
  };
  const anchorChange =
    d.anchor !== target.anchor ? `\n      anchor: ${d.anchor}  →  ${target.anchor}` : "";
  console.log(`${d.language} #${d.order}: "${d.title}"\n      title : → "${target.title}"${anchorChange}`);
  tx.patch(d._id, { set });
  n++;
}

if (!COMMIT) {
  console.log(`\nDRY RUN — ${n} docs would be patched. Re-run with --commit (and SANITY_WRITE_TOKEN set in .env.local) to apply.`);
  process.exit(0);
}
if (!TOKEN) {
  console.error("\n❌ SANITY_WRITE_TOKEN is required for --commit. Add it to .env.local (Editor token).");
  process.exit(1);
}
await tx.commit();
console.log(`\n✅ Committed ${n} patches to ${DATASET}.`);
