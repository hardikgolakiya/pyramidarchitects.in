# Brand assets

Built from the two supplied files (`Pyramid.png` 800x280 and the ARTISTRY logo 1869x2000). Rebuild script is not committed; ask to regenerate.

| File | Use |
|---|---|
| `logo-wordmark.svg` / `-white.svg` / `-currentcolor.svg` | Main logo (PYRAMID with triangle A and base mark). Ratio 3.464:1 (753x217). "ARCHITECTURE & CIVIL" tagline removed. |
| `logo-wordmark-{400,800,1600}.png`, `-white-...png`, `logo-wordmark-1600.webp` | Raster fallbacks, transparent |
| `logo-mark.svg` / `-white.svg` / `-currentcolor.svg` | Mono logo: triangle mark only, 19-vertex exact polygon (487 bytes). Ratio 1.125:1 (1784x1586). "ARTISTRY" caption removed. |
| `logo-mark-{128,256,512,1024}.png`, `-white-...png`, `logo-mark-1024.webp` | Raster fallbacks, transparent |
| `og-image.png` / `.jpg` | 1200x630 social card, wordmark on sand #EDE6D6 |
| `../favicon.ico` | 16, 32, 48 px |
| `../icon.svg` | Adaptive favicon (black on light, white on dark tab) |
| `../apple-touch-icon.png` | 180x180, white background |
| `../icons/icon-{16,32,48,96,192,512}.png` | Transparent PNG icons |
| `../icons/maskable-{192,512}.png` | Android maskable, mark inside 80% safe zone |
| `../site.webmanifest` | PWA name/icons (theme colour white; change when brand colours are set) |

Use the `-currentcolor` SVGs inline or via CSS mask when the logo must follow text colour (e.g. nav with mix-blend-difference).

Limits: the wordmark is traced from an 800 px raster, so edges are slightly softer than a true vector at very large sizes (about 1400 px wide and above). Please share the original vector (AI/SVG/PDF) if one exists and I will swap it in.
