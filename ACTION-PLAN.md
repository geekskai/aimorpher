# Aimorpher SEO Action Plan

## P0 — Implemented in this working tree

- [x] Add a dynamic, resilient sitemap with fixed public routes and live primary profiles only.
- [x] Add sitemap discovery and private-route exclusions to robots.txt.
- [x] Replace invalid-profile homepage redirects with real 404 behavior.
- [x] Apply self-canonical URLs to fixed public pages and primary profiles.
- [x] Apply `noindex,follow` to all accessible job-specific profile versions.
- [x] Add valid WebSite, WebApplication, Organization, ContactPage, and ProfilePage JSON-LD.
- [x] Align homepage metadata, H1, body copy, and internal links with resume website builder intent.
- [x] Add About and Contact trust pages and expose the selected support address.
- [x] Add SEO regression coverage; complete unit tests, type checking, build, and diff validation.

## P0 — Deployment acceptance

1. Restart the user-managed development process and visually check `/`, `/about`, `/contact`, `/pricing`, `/sample`, one live primary profile, and one job-specific version at desktop and 390×844.
2. Confirm `support@aimorpher.com` can receive a test message before publishing the Contact link.
3. Deploy the current commit-equivalent build and confirm `/robots.txt` and `/sitemap.xml` return 200 responses.
4. Validate the rendered homepage, Contact page, and a real primary profile in Schema.org Validator or Google Rich Results Test.
5. Confirm a nonexistent username returns a real 404 and a live job-specific version renders `noindex,follow`.
6. With separate authorization, submit `/sitemap.xml` in Search Console and inspect the homepage plus one live primary profile.

## P1 — After P0 deployment

- Build distinct-intent pages for developer portfolio builder, resume website examples, and an editorial guide to turning a resume into a website. Each page needs original examples and must avoid competing with the homepage target term.
- Add real customer evidence and a product help area when source material exists; do not create placeholder testimonials or inflated usage claims.
- Configure ESLint as a separate repository-quality task, then restore a non-interactive lint command in CI.

## P2 — Data dependent

- Use production CrUX and Search Console data before changing image optimization or third-party script behavior.
- Reassess `llms.txt` and broader GEO work after the core entity and content architecture has been indexed and measured.

## Measurement

- Preserve the August 23, 2026 Search Console baseline: 6 impressions, 0 clicks, 0% CTR, average position 6.3 over 28 days.
- Review the next complete 28-day window for non-brand impressions, indexed canonical pages, sitemap errors, and unexpected indexing of job-specific versions.
- Treat rankings and clicks as observation metrics, not guaranteed outcomes of this code batch.
