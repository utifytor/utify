# Utify — privacy utilities for Tor

Free, open-source utilities served as a Tor onion service. No ads, no analytics, no tracking, no accounts. Funded by optional donations.

## The architecture in one paragraph

"Works without JavaScript" and "files never leave your device" pull in opposite directions, so Utify resolves it per tool with **three explicit modes**, printed on every card:

| Mode | JS on | JS off (Tor "Safest") |
|---|---|---|
| `CLIENT-SIDE · NO-JS FALLBACK` (text tools) | Runs entirely in the browser; nothing transmitted | Plain HTML form POSTs to a Next.js **server action**; the *same pure function* runs in memory and the result is returned in the re-rendered page |
| `CLIENT-SIDE · JS REQUIRED` (file tools) | Runs entirely in the browser via File/Canvas/Web Crypto APIs | Refuses, with an honest `<noscript>` explanation. We never fall back to uploading files |
| `SERVER (IN-MEMORY) · NO-JS OK` (e.g. QR → inline SVG) | Same as JS off | Computed server-side in memory, never stored or logged |

Both paths import identical functions from [`lib/compute.ts`](lib/compute.ts), so the privacy badges are provable from the code, not marketing copy. Server actions here are pure: no database, no filesystem writes, no logging of input.

The homepage search is a plain `GET` form (works no-JS); [`components/LiveFilter.tsx`](components/LiveFilter.tsx) upgrades it to instant filtering when JS is available.

## Stack

Next.js 15 (App Router, server actions) · React 19 · TypeScript · Tailwind CSS v4. No webfonts (Tor Safest blocks them; system stacks only). No third-party requests of any kind at runtime. Client bundles are ~100 kB shared; file-tool pages lazy-load `exifr`.

## Implemented

- **Files & privacy:** metadata remover (canvas re-encode), EXIF viewer, file hash generator (SHA-256/512 via Web Crypto, MD5 via `lib/md5.ts` — verified against RFC 1321 vectors, kept for legacy checksums only)
- **Passwords:** password generator (unbiased rejection sampling), passphrase generator (256-word list, exactly 8 bits/word), entropy calculator, token generator, UUID v4
- **Developer:** Base64, URL encode/decode, JSON formatter/validator, JWT decoder (decode only — never verifies signatures)
- **Misc:** QR generator (server-rendered SVG, works with zero JS), case converter

Stubs registered in [`lib/tools.ts`](lib/tools.ts) and shown as "SOON": checksum verifier, image converter, PDF metadata remover, diff, Markdown preview, QR reader, random string. Adding a text tool = one pure function in `lib/compute.ts`, one action wrapper, one entry in `forms.tsx`, one registry row.

## Run

```bash
npm install
npm run build
npm start          # binds :3000
```

`npx next telemetry disable` once after install — Next.js otherwise sends anonymous build telemetry, which is off-brand here.

## Serving as an onion service

Server actions require the Node server (static export is impossible — and unnecessary, since the no-JS fallback *is* the backend). Bind Next.js to localhost only and point tor at it:

```
# /etc/tor/torrc
HiddenServiceDir /var/lib/tor/utify/
HiddenServicePort 80 127.0.0.1:3000
```

Hardening checklist:

- Run Next.js as an unprivileged user; bind `127.0.0.1` only (`next start -H 127.0.0.1`).
- Disable access logs in any reverse proxy, or run without one.
- Add an onion-location-free CSP via proxy or middleware, e.g. `default-src 'self'; script-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'`.
- Keep the donation addresses in `app/layout.tsx` (currently placeholders) signed in the repo so users can verify them against the site.
- Publish reproducible-build instructions so the badge claims can be independently verified.

## Verify, don't trust

Every privacy claim on the site maps to a file you can read:

- Data routing: `app/tools/actions.ts` (no-JS path) and `components/forms.tsx` (JS path) import the same `lib/compute.ts`
- File tools never upload: `components/fileTools.tsx` has no fetch, no form action, no network call
- Badges: generated from `lib/tools.ts`, the same registry that routes each tool

## License

AGPL-3.0. Anyone running a modified Utify must publish their changes — which is the point.
