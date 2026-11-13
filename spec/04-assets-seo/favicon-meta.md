# Favicon and head metadata

Both routes are statically prerendered (`x-nextjs-prerender: 1`) and emit the head below (Next.js `metadata` API; root layout provides defaults, `/` overrides title/description, `/tour` overrides title/description).

## `/` head (in emitted order)
```html
<meta charSet="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<!-- font + image + css preloads, see performance.md -->
<meta name="next-size-adjust" content=""/>
<title>STILL / FORM — Contemporary Architecture &amp; Residences</title>
<meta name="description" content="Discover STILL / FORM, a study in contemporary residential architecture, considered spaces, material, and light. Explore the residences through immersive 3D experiences."/>
<link rel="canonical" href="https://stillform.homes/"/>
<meta property="og:title" content="STILL / FORM — Space, considered."/>
<meta property="og:description" content="Residences shaped by architecture, light, and material."/>
<meta property="og:url" content="https://stillform.homes/"/>
<meta property="og:site_name" content="STILL / FORM"/>
<meta property="og:locale" content="en_US"/>
<meta property="og:image" content="http://localhost:3000/images/still-form-social.jpg"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:alt" content="STILL / FORM contemporary residential architecture"/>
<meta property="og:type" content="website"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="STILL / FORM — Space, considered."/>
<meta name="twitter:description" content="Residences shaped by architecture, light, and material."/>
<meta name="twitter:image" content="http://localhost:3000/images/still-form-social.jpg"/>
<link rel="icon" href="/favicon.ico?favicon.3t_h_t4wla4c5.ico" sizes="256x256" type="image/x-icon"/>
<script src="/_next/static/chunks/0cz1d0mv5g_q7.js" noModule=""></script>  <!-- Next polyfills -->
```
`<html lang="en" class="... h-full antialiased">`, `<body class="min-h-full flex flex-col">`.

## `/tour` head differences
- `<title>3d Tour</title>`
- `<meta name="description" content="Explore a 3D tour of a modern apartment."/>`
- **Canonical is `https://stillform.homes/` (not `/tour`)** and `og:url` is `https://stillform.homes/`; OG/Twitter title, description and image are identical to `/` (inherited from the root layout). No hero/image preloads.

## Defects in the reference to FIX in the rebuild
1. `og:image` / `twitter:image` resolve to `http://localhost:3000/images/still-form-social.jpg` (a `metadataBase` left at localhost) and the file returns **404** on production (`/images/still-form-social.jpg`). Rebuild: set `metadataBase: new URL('https://<client-domain>')`, supply a real 1200x630 JPG/PNG at `/public/images/og.jpg`, or use `app/opengraph-image.*`.
2. `/tour` canonical should be `/tour`; use per-route `alternates.canonical`.
3. `/tour` title "3d Tour" is a placeholder; use e.g. `3D Tour | <Brand>`.
4. No `theme-color`, no `manifest`, no `apple-touch-icon`, no `robots` meta, no `format-detection`, no JSON-LD.

## Metadata object to implement (Next App Router)
```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://<domain>'),
  title: '<BRAND> — <tagline / descriptor>',          // ~55 chars, em dash separator
  description: '<~150-160 char summary: discipline, space, light, material, 3D experience>',
  alternates: { canonical: '/' },
  openGraph: { title: '<BRAND> — <short slogan>', description: '<one line>', url: '/', siteName: '<BRAND>', locale: 'en_US', type: 'website',
    images: [{ url: '/images/og.jpg', width: 1200, height: 630, alt: '<alt>' }] },
  twitter: { card: 'summary_large_image', title: '<same as og>', description: '<same>', images: ['/images/og.jpg'] },
};
// tour/page.tsx: title '3D Tour — <BRAND>', description 'Explore a 3D tour of a modern apartment.', alternates: { canonical: '/tour' }
```
Length reference: title 57 chars, description 163 chars, OG title 33, OG description 54.

## Favicon
- Single file: `/favicon.ico`, served as `content-type: image/vnd.microsoft.icon`, `cache-control: public, max-age=0, must-revalidate`, ETag, 203,321 bytes (large because it is a multi-image ICO).
- ICO header: 8 images, all 32-bit: **16, 24, 32, 64, 72, 96, 128, 256 px** (the head tag declares `sizes="256x256"`, `type="image/x-icon"`).
- Emitted through the Next file convention `app/favicon.ico` (hence the hashed query `?favicon.3t_h_t4wla4c5.ico`).
- No `icon.svg`, `icon.png`, `apple-icon.png` (all 404), no web manifest (`/manifest.webmanifest` 404), no `theme-color`, no mask icon.
- Rebuild: supply a square master mark (SVG + 512 px PNG); generate `app/favicon.ico` (16/32/48), `app/icon.svg`, `app/apple-icon.png` (180x180), and `app/manifest.ts` (name, short_name, `theme_color`, `background_color: '#EDE6D6'`). Suggested `viewport.themeColor`: `#EDE6D6` light (the page's beige) or `#0a0a0a` (body background `rgb(10,10,10)` shown behind the hero).
