/**
 * One-time seed script: patches the 7 English Sanity service documents with
 * the compact card content (cardTitle + cardDescription) used on the Home page.
 *
 * Requirements:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID  (already set in .env.local)
 *   - NEXT_PUBLIC_SANITY_DATASET     (already set in .env.local)
 *   - SANITY_WRITE_TOKEN             (add to .env.local — see README below)
 *
 * How to get a write token:
 *   Sanity dashboard → your project → API → Tokens → Add API token
 *   Choose "Editor" permission level, copy the token into .env.local.
 *
 * Usage:
 *   node scripts/seed-services.mjs
 *
 * Safe to re-run — it only sets the card fields; all other document data is
 * left untouched. Documents that don't match a known anchor are skipped.
 */

import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const { NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN } =
  process.env;

if (!NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error("❌  NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local");
  process.exit(1);
}
if (!SANITY_WRITE_TOKEN) {
  console.error(
    "❌  SANITY_WRITE_TOKEN is not set in .env.local\n" +
    "   Get one at: Sanity dashboard → your project → API → Tokens → Add API token"
  );
  process.exit(1);
}

const client = createClient({
  projectId: NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token:     SANITY_WRITE_TOKEN,
  useCdn:    false,
});

/** Compact card copy — exact content matching the Home page design. */
const CARD_CONTENT = {
  ior: {
    cardTitle:       "IOR / EOR Services",
    cardDescription: "Import and export on your behalf — without establishing a local legal entity.",
  },
  ddp: {
    cardTitle:       "DDP",
    cardDescription: "End-to-end Delivered Duty Paid solutions that remove risk and ensure complete compliance across all destinations.",
  },
  freight: {
    cardTitle:       "Freight Forwarding",
    cardDescription: "Air, sea, and land shipments managed with full compliance from documentation to final delivery.",
  },
  logistics: {
    cardTitle:       "Logistics & Supply Chain Solutions",
    cardDescription: "End-to-end supply chain planning and optimization — IOR/EOR, 3PL warehousing, freight coordination, and reverse logistics.",
  },
  compliance: {
    cardTitle:       "Trade Compliance",
    cardDescription: "Compliantly ship dual-use technology hardware across borders without navigating regulations alone.",
  },
  customs: {
    cardTitle:       "Customs Clearance",
    cardDescription: "Import and export clearance with ACID registration, Nafeza processing, and full documentation support.",
  },
  warehousing: {
    cardTitle:       "Warehousing & Storage",
    cardDescription: "State-of-the-art facilities for domestic and international shipments — flexible and scalable.",
  },
};

console.log("🔍  Fetching English service documents from Sanity…");

const docs = await client.fetch(
  `*[_type == "service" && language == "en"] { _id, "anchor": anchor.current }`
);

if (docs.length === 0) {
  console.warn("⚠️   No English service documents found. Have you added them in Sanity Studio?");
  process.exit(0);
}

console.log(`📄  Found ${docs.length} document(s). Patching card fields…\n`);

const tx = client.transaction();
let patched = 0;
let skipped = 0;

for (const doc of docs) {
  const content = CARD_CONTENT[doc.anchor];
  if (!content) {
    console.log(`  ⏭  Skipping unknown anchor: "${doc.anchor}"`);
    skipped++;
    continue;
  }
  tx.patch(doc._id, { set: content });
  console.log(`  ✓  Queued patch for "${doc.anchor}"`);
  patched++;
}

await tx.commit();

console.log(`\n✅  Done — ${patched} document(s) patched, ${skipped} skipped.`);
console.log(
  "\nNote: Arabic service cards continue to use ar.json as fallback.\n" +
  "To add Arabic card content, open Sanity Studio and fill in\n" +
  "'Card title' and 'Card description' on each Arabic service document."
);
