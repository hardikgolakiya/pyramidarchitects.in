# Forms, links, CTAs, endpoints

## Summary
- There are **no HTML forms, no inputs, no `fetch`/XHR calls, no `/api/*` routes, and no form backends** in either route (verified: raw HTML has no `form`/`input`; no `/api/` strings or app-level `fetch(` calls in the chunks; only library loaders fetch assets). Contact is `mailto:` plus clipboard copy. Therefore no validation rules exist in the reference.
- Recommended improvement (optional, flag to client): add an enquiry form behind the same overlay (spec below), submitted to a Next.js Route Handler. Keep `mailto:` as a fallback.
- No analytics/tag scripts found (client to specify GA4/Plausible: TODO-CLIENT).

## Link inventory (home `/`)
| # | Where | Label (slot) | Type | Target in reference | Rebuild target |
|---|---|---|---|---|---|
| 1 | Nav wordmark | wordmark | internal | `/` | `/` |
| 2 | Nav menu button | MENU | button | toggles `#site-menu` | same |
| 3 | Nav item 1 | Residence | hash | `#marquee-transition` | `/#marquee-transition` (smooth scroll via Lenis) |
| 4 | Nav item 2 | Stays | hash | `#residence-02` | `/#residence-02` |
| 5 | Nav item 3 | Tour | route | `/tour` | `/tour` (next/link, prefetch) |
| 6 | Nav item 4 | Contact | button | opens contact overlay | same |
| 7 | Hero CTA 1 | Explore | hash | `#marquee-transition` | same |
| 8 | Hero CTA 2 | Experience the space | hash | `#residence-02-tour` | same |
| 9 | Tour teaser CTA | Enter ... -> | route | `/tour` | `/tour` |
| 10 | Footer wordmark | | internal | `/` | `/` |
| 11 | Footer Explore 1 | Residence 01 | hash | `#residence-slides` | same |
| 12 | Footer Explore 2 | Residence 02 | hash | `#residence-02` | same |
| 13 | Footer Follow: Website | | external `_blank rel=noreferrer` | developer's personal site | TODO-CLIENT |
| 14 | Footer Follow: LinkedIn | | external | personal profile | TODO-CLIENT |
| 15 | Footer Follow: X | | external | personal profile | TODO-CLIENT (optional) |
| 16 | Footer Follow: Instagram | | external (URL has tracking query) | personal profile | TODO-CLIENT (strip `utm_*`) |
| 17 | Footer Contact | button | opens overlay | same |
| 18 | Footer availability pill | button | opens overlay | same |
| 19 | Footer Back to top | | hash | `#top` (`<main id="top">`) | same |

Note: the reference's footer/overlay social links and email belong to an individual (portfolio author) rather than to the featured brand. They are not to be reused; slot them as TODO-CLIENT.

## Link inventory (`/tour`)
| Where | Label | Target |
|---|---|---|
| Nav (same as home, hash links unresolved on /tour) | | recommended `/#...` absolute-hash form |
| BackToSite | "Back to site" | `/` |

## Contact overlay
| Element | Behaviour |
|---|---|
| Trigger | nav "Contact" button, footer "Contact" button, footer availability pill |
| Email link | `mailto:{EMAIL}` (shows email text + arrow icon, `truncate`) |
| Copy button | `navigator.clipboard.writeText(EMAIL)`; fallback offscreen `<textarea readonly>` + `document.execCommand('copy')`; label toggles Copy -> Copied for 1800ms; icon swaps copy -> check |
| Card 1 | `mailto:{EMAIL}?subject=<encodeURIComponent(subject1)>` (reference subject = freelance-project enquiry) |
| Card 2 | `mailto:{EMAIL}?subject=<encodeURIComponent(subject2)>` (reference subject = full-time opportunity) |
| Social pills | external, `target=_blank rel="noopener noreferrer"`, `aria-label` = label |
| Close | button (`aria-label="Close contact"`), Esc key; no backdrop-click close (overlay is full screen) |
| Hash/URL | opening does not change the URL (no history entry); recommended: leave as is |

Placeholders: `EMAIL = TODO-CLIENT`, subjects "New project enquiry" and "Career enquiry".

## Optional enquiry form (recommended addition, not in reference)
Only build if the client wants it; otherwise ship mailto.

| Field | Type | Required | Validation | Autocomplete |
|---|---|---|---|---|
| name | text | yes | 2-80 chars, trimmed | `name` |
| email | email | yes | RFC-lite regex + max 254 | `email` |
| phone | tel | no | digits, spaces, `+-()`; 7-20 chars | `tel` |
| project type | select | yes | one of: Residential, Commercial, Interiors, Other | - |
| location | text | no | <= 120 | - |
| budget | select | no | ranges TODO-CLIENT | - |
| message | textarea | yes | 10-2000 chars | - |
| consent | checkbox | yes | must be true (privacy notice link TODO-CLIENT) | - |
| company (honeypot) | hidden text | no | must be empty; reject otherwise | off |

- Endpoint: `POST /api/contact` (Route Handler, `runtime = 'nodejs'`), JSON body, zod validation (same schema client+server), returns `200 {ok:true}` or `422 {errors:{field:msg}}`; rate limit by IP (Vercel KV / Upstash) 5 req/10 min; send via Resend/Postmark to `CONTACT_TO_EMAIL`; env vars `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
- States: idle, validating (inline errors under fields, `aria-invalid`, `aria-describedby`), submitting (button disabled, label "Sending..."), success (replace form with thank-you line), error (retry + mailto fallback).
- Anti-spam: honeypot + minimum fill time (>= 3s) + optional Cloudflare Turnstile (TODO-CLIENT).

## Hash anchors that must exist (ids)
`#top` (main), `#about`, `#marquee-transition`, `#residence-slides`, `#residence-02`, `#residence-02-tour`, `#contact` (footer), `#site-menu` (nav panel). Hash navigation with pinned/scrubbed sections: scroll to the section's pin-start offset using Lenis `scrollTo` (not native jump) so ScrollTrigger positions are correct. Note `#marquee-transition` is a 1020vh runway; the target is its top.

## Sitemap / robots
`sitemap.xml` lists `/` (priority 1.0, monthly) and `/tour` (0.8, monthly), lastmod from the reference (2026-10-14). Rebuild via `app/sitemap.ts`; domain TODO-CLIENT. `robots.txt` not captured (owned by assets-seo).
