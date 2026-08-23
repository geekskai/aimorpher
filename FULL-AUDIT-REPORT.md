# Aimorpher SEO Audit Report

Audit date: August 23, 2026  
Scope: current repository implementation, the localhost homepage observed before implementation, and the Aimorpher Search Console 28-day Performance report. Production deployment behavior is not inferred from local code.

## Audit summary

- Baseline rating: **Poor / needs improvement (48/100, low score confidence)**. The numeric score is directional because production crawl, response-header, indexing, and Core Web Vitals evidence is incomplete.
- Search Console baseline: **6 impressions, 0 clicks, 0% CTR, average position 6.3**. The only visible query was `aimofr`, with 3 impressions.
- Top confirmed gaps were missing sitemap discovery, incomplete canonical/indexing behavior, missing homepage schema, and weak non-brand search-intent coverage.
- The P0 code batch addresses those four areas and adds minimum About and Contact trust paths. Ranking or traffic improvement cannot be confirmed until deployment and a new measurement window.

## Findings

| Area | Severity | Confidence | Finding | Evidence | P0 resolution |
| --- | --- | --- | --- | --- | --- |
| Crawlability | Warning | Confirmed | No sitemap implementation or robots sitemap directive existed. | The repository contained `app/robots.txt` but no sitemap route; robots only disallowed preview and upload paths. | Added dynamic `/sitemap.xml`, hourly cached live-primary-profile discovery, static fallback, and an absolute Sitemap directive. |
| Indexability | Warning | Confirmed | Missing or unpublished primary profiles redirected to the homepage, creating soft-404 semantics. | The primary profile route called `redirect()` for both missing-user and missing-resume states. | Replaced redirects with `notFound()` and added `noindex,nofollow` not-found metadata. |
| Duplicate/privacy control | Warning | Confirmed | Job-specific profile versions lacked an explicit index policy. | Live job profile metadata had a title and description only. | All accessible job versions now return `noindex,follow`; inaccessible versions remain 404 and versions are excluded from sitemap. |
| Canonicals | Warning | Confirmed | Homepage, fixed public pages, and primary profiles lacked explicit canonical URLs. | No canonical was rendered on the pre-change localhost homepage and no `alternates.canonical` existed in affected metadata. | Added self-referencing canonicals to every fixed public route and each primary profile. |
| Structured data | Warning | Confirmed | Homepage had no JSON-LD; profile markup exposed a bare Person and could serialize `email: false`. | Rendered homepage contained no JSON-LD. The profile object used a boolean short-circuit directly as the email value. | Added Organization, WebSite, WebApplication, ContactPage, and ProfilePage to Person JSON-LD; optional fields are omitted and serialized markup escapes `<`. |
| On-page intent | Warning | Confirmed | The hero emphasized a brand metaphor and implied broader GitHub ingestion than the PDF-based flow implements. | H1 was “Your resume is the source. Your profile is the deploy.” and body copy said “Turn your resume, GitHub...” while the product flow starts from a PDF. | H1 and metadata now target “resume website builder”; copy accurately describes PDF input and limits GitHub claims to links present in source material or added during editing. |
| Content depth | Warning | Confirmed | Homepage did not fully explain audience, review, privacy, Free/Pro boundaries, or common objections. | The pre-change page had a hero, three benefit cards, three steps, and pricing summary, but no FAQ or detailed product-fit section. | Added product-fit, editing, visibility, pricing, deletion, and plain-content FAQ sections without restricted FAQ schema. |
| Trust / E-E-A-T | Warning | Confirmed | No About or Contact route existed, and the refund policy referenced an unspecified support address. | Route inventory lacked `/about` and `/contact`; footer contained only legal links. | Added About and Contact pages, `support@aimorpher.com`, stable internal links, safe support instructions, and ContactPage markup. |
| Performance | Info | Likely | Disabling Next image optimization may increase image weight. | `next.config.mjs` contains `images.unoptimized: true`. No production CrUX/PageSpeed result was collected. | Deferred until production field or lab evidence identifies a real bottleneck. |
| GEO | Info | Hypothesis | `llms.txt` and dedicated citation-oriented content may help future AI discovery. | No `llms.txt` exists, but current non-brand search coverage and entity basics are the more immediate constraint. | Deferred to P2 after crawl, entity, and content foundations are measured. |

## Implemented P0 behavior

- `/sitemap.xml` always includes the eight canonical marketing/legal routes. At request time it scans `resume:*` in batches and adds only records with a live status, non-empty resume data, and a valid `user:id:*` mapping.
- Sitemap discovery is resilient: the route is dynamic so builds do not depend on Upstash; Redis errors return the static sitemap instead of a failed response.
- `/upload`, `/preview`, `/pdf`, and `/api/` are explicitly disallowed. Fixed route names are reserved so new usernames cannot collide with product pages.
- Homepage product/pricing schema contains only currently implemented features and Free, $12 monthly, and $96 annual offers. No ratings, reviews, FAQPage, or deprecated HowTo markup was added.
- Public profile markup respects email visibility and emits only non-empty image, email, and sameAs fields.

## Verification evidence

- `npm run test:run`: **11 files, 45 tests passed**.
- `npx tsc --noEmit`: **passed**.
- `npm run build`: **passed** on Next.js 15.1.9; `/sitemap.xml` is reported as a dynamic route and the build made no Redis request.
- Schema validation script completed without reporting deprecated or malformed static blocks. Dynamic JSON-LD builders are covered by seven SEO regression tests, including private-email omission and script-safe serialization.
- `git diff --check`: **passed**.
- `npm run lint`: **not completed** because the repository has no ESLint configuration and `next lint` opened the interactive setup prompt.

## Unknowns and follow-ups

- Production deployment parity, response headers, final rendered canonicals, schema validator results against production HTML, and sitemap contents with real Redis data remain unverified until deployment.
- Production Core Web Vitals and mobile performance remain unknown; no performance defect is claimed.
- `support@aimorpher.com` was selected for the implementation but mailbox delivery was not externally tested.
- Post-change desktop/mobile browser screenshots could not be completed because the user's already-running Next development process referenced stale `.next` chunks after the required production build. The user must restart that existing process; the agent did not start or restart a server.
- Search Console sitemap submission and URL inspection are external state changes and were not performed.
