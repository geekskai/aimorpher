# ADR 0001: Profile value metric and billing boundary

- Status: Accepted
- Date: 2026-08-23

## Context

Aimorpher helps a person turn verified career facts into public and job-specific professional Profiles. AI calls are a delivery cost, but users receive durable value from maintaining distinct Profiles and URLs for opportunities.

The legacy Redis record embedded `plan` in resume content. That lets content writes influence commercial access and makes payment lifecycle changes difficult to reason about.

## Decision

Profile count is the primary value metric: Free stores one Primary Profile; Pro stores up to five total Profiles. AI generations remain a cost-control entitlement at 3 or 30 successful generations per 30-day window.

Billing state is stored in an independent `BillingAccount`. Product surfaces consume only server-resolved `Entitlements`; clients never choose their plan or Creem Product ID. Legacy `plan=pro` records migrate lazily to `source=manual`, retain Pro access, and require human review.

## Consequences

Downgrade preserves the Primary Profile under Free presentation rules and locks other Profiles for 30 days. Billing webhooks become the authority for Creem access; checkout redirects never grant access. This adds explicit migration, quota, lifecycle, and webhook test requirements but prevents profile content and billing state from drifting together.
