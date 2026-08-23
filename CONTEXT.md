# Aimorpher Product Context

This document is the shared vocabulary for product, billing, UI, API, and support work.

- **Profile**: A saved, publishable presentation of a user's professional facts. A Billing Account owns one or more Profiles.
- **Primary Profile**: The first Profile, backed by the legacy `resume:{userId}` record and published at `/{username}`. It remains available on Free.
- **Job-specific Version**: A Profile cloned from the Primary Profile for a target role and published at `/{username}/{versionSlug}`. The AI may reorder or rewrite existing facts but may not invent facts. The pasted job description is not persisted.
- **Successful AI Generation**: A model response that completes and passes `ResumeDataSchema` validation. Failures, retries, edits, saves, previews, and publishes do not consume quota.
- **Billing Account**: Server-owned payment and subscription state associated with one Clerk user. It is stored separately from Profile content.
- **Entitlement**: A server-resolved capability derived from the Billing Account, such as Profile count, generation quota, themes, branding, or analytics.
- **Trial**: The one-time, card-required 7-day Creem trial offered only for Monthly Pro. Annual Pro has no trial.
- **Grace Period**: Three days after a payment enters `past_due` during which Pro entitlements remain available.
- **Generation Window**: A rolling account window anchored on first use and lasting 30 days. Upgrading increases the current window's limit without resetting usage.
- **Locked Version**: A Job-specific Version made private and read-only after downgrade. It expires after 30 days unless Pro is restored.

Canonical commercial terms: Free has 1 Profile and 3 successful generations per 30 days. Pro has 5 total Profiles and 30 successful generations per 30 days. Monthly is USD $12 and Annual is USD $96, both tax-inclusive.
