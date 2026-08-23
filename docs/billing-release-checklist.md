# Billing release checklist

Self-serve billing is fail-closed. `CREEM_SELF_SERVE_ENABLED=true` must not be set in production until every Live gate below passes. Do not copy Test identifiers or secrets into Live variables.

## Environment contract

Set these outside the repository; do not commit them to `.env`:

- `CREEM_ENVIRONMENT=test|live`
- `CREEM_TEST_API_KEY`, `CREEM_TEST_WEBHOOK_SECRET`, `CREEM_TEST_MONTHLY_PRODUCT_ID`, `CREEM_TEST_ANNUAL_PRODUCT_ID`
- `CREEM_LIVE_API_KEY`, `CREEM_LIVE_WEBHOOK_SECRET`, `CREEM_LIVE_MONTHLY_PRODUCT_ID`, `CREEM_LIVE_ANNUAL_PRODUCT_ID`
- `CREEM_SELF_SERVE_ENABLED=true` only for an approved environment
- `TOGETHER_RESUME_MODEL` for a currently supported Together model

The monthly product must be USD $12, tax-inclusive, recurring monthly, with a 7-day card-required trial. The annual product must be USD $96, tax-inclusive, recurring yearly, with no trial.

## Test Mode regression

- Monthly trial starts once, records the end date, cancels without charge, and converts after seven days.
- A Billing Account with `trialUsedAt` cannot receive Pro from another `subscription.trialing` event; a later paid event may activate it.
- Annual checkout has no trial and records annual cadence.
- Portal opens, payment method updates work, and cancellation produces scheduled and terminal events.
- Monthly to annual charges the prorated difference immediately.
- Annual to monthly schedules cancellation at period end and requires a new monthly checkout then.
- Past-due retains Pro for three days, then applies Free rendering and locks versions for 30 days.
- Refund, duplicate event, out-of-order event, bad signature, and unknown Product ID fixtures do not grant incorrect access.

## Live gate

- Creem merchant review is confirmed approved.
- Live products and webhook endpoint are created independently and their IDs match the contract above.
- The supported Together model passes fixed resume fixtures for schema success, fact fidelity, latency, and cost.
- Production terms, privacy, refund copy, support route, and tax display are reviewed.
- Tests, TypeScript, lint, production build, `git diff --check`, and production browser QA pass.

## Pricing decision window

Observe at least 30 days and at least 20 monthly trial starts before changing price. If the sample is smaller, do not interpret low revenue as price rejection. Review registration, first successful generation, and first publish conversion before testing a lower price.
