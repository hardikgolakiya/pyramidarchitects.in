# `#marquee-transition`: grow window, ink window, views (pin 4680-12960, 8280 px, scrub .8)

1440x900. p = (scrollY - 4680)/8280. Settle 1050 ms. Card = `.marquee-canvas` (centred at start 528,279,384x342).

## Grow window, 1% steps (0.01 = 82.8 px)
| p | scrollY | card x,y | card w x h | radius | prompt op | track op / ty | HUD op |
|---|---|---|---|---|---|---|---|
| 0 | 4680 | 528,279 | 384x342 | 4 | 1 | 1 / 0 | 0 |
| .01 | 4763 | 526.3,278.1 | 387.3x343.8 | 4 | .693 | 1 / 0 | 0 |
| .02 | 4846 | 514.8,272 | 410.5x356 | 4 | .385 | 1 / 0 | 0 |
| .03 | 4928 | 483.8,255.7 | 472.4x388.7 | 4 | .082 | .874 / -3.4 | 0 |
| .04 | 5011 | 422.9,223.5 | 594.1x453 | 3 | 0 | .720 / -7.6 | 0 |
| .05 | 5094 | 322.4,170.4 | 795.1x559.3 | 2 | 0 | .567 / -11.7 | 0 |
| .06 | 5177 | 189.6,100.2 | 1060.8x699.6 | 1 | 0 | .413 / -15.9 | 0 |
| .07 | 5260 | 94.9,50.2 | 1250.1x799.7 | 1 | 0 | .259 / -20 | 0 |
| .08 | 5342 | 39.1,20.6 | 1361.9x858.7 | 0 | 0 | .107 / -24.1 | 0 |
| .09 | 5425 | 10.8,5.7 | 1418.4x888.6 | 0 | 0 | 0 / -27 | 0 |
| .10 | 5508 | 1.1,.6 | 1437.8x898.9 | 0 | 0 | 0 / -27 | 0 |
| .11 | 5591 | 0,0 | 1440x900 | 0 | 0 | 0 | 1 |

Fits:
- Card: `power2.inOut` (cubic in/out) over P_GROW = .1087 (900 px): w(83)=384+1056*4*(83/900)^3 = 387.3. Exact. Radius 4 -> 0 follows the same curve (rounded to px).
- Prompt: linear over 30vh = 270 px (`1 - y/270`).
- Track: linear opacity and yPercent from 180 px to 720 px (`-27 px` = -25% of 108 px).
- HUD layer: switches on when p >= .1087 (CSS 700 ms opacity transition): 0 at p .10, 1 at p .11. Held 1 to the end.
- Photo is a viewport-fixed window: card shows more of the same picture (no scaling), confirmed by screenshot at p .05: card in front of the oversized brand text, photo not rescaled.

## Ink window (p .1087-.2391, scroll 5580-6660)
Visual only (uniforms unreachable). Screenshots at 0.3 scale: p .115 photo intact, fullscreen; p .15 still intact; p .19 mostly dissolved with speckled remnants of the photo over the blue 3D scene; p .225 clean 3D villa (sky env, red car) with only a few photo specks. With uProgress = 1.5*(p-.1087)/.1304 the formula `alpha = 1 - smoothstep(0,1, fbm - (1 - 1.2*uProgress))` predicts: p .15 uP .475 (arg = fbm - .43, mostly small, alpha stays ~.9-1), p .19 uP .935 (arg = fbm + .12, alpha ~.3), p .225 uP 1.36 (alpha ~0): consistent with what was seen. Blobs animate with time (`uTime*.16`), so frames differ between screenshots at the same scroll.

## Views and HUD (p .2391-1)
Verified to the pixel row: `view = floor((p-.2391)/.7609*7)`, boundaries at p .3478, .4565, .5652, .6739, .7826, .8913.
| scrollY | p | view title | counter | progress bar scaleX | rail fill scaleY |
|---|---|---|---|---|---|
| 6667 | .24 | Full View | 01 | .0011 | 0 |
| 6750 | .25 | Full View | 01 | .0143 | 0 |
| 7164 | .30 | Full View | 01 | .080 | .010 |
| 7559 | .3477 | Full View | 01 | .1427 | .0831 |
| 7561 | .3479 | Walls | 02 | .1430 | .0835 |
| 7992 | .40 | Walls | 02 | .2114 | .1633 |
| 8460 | .4565 | Floor | 03 | .2859 | .250 |
| 8820 | .50 | Floor | 03 | .3429 | .3167 |
| 9648 | .60 | Roof | 04 | .4743 | .470 |
| 10476 | .70 | Pillars | 05 | .6057 | .6233 |
| 11304 | .80 | Stairs | 06 | .7371 | .7767 |
| 12132 | .90 | Windows & Doors | 07 | .8686 | .930 |
| 12546 | .95 | Windows & Doors | 07 | .9343 | 1 |
| 12960 | 1.0 | Windows & Doors | 07 | 1 | 1 |
- Progress bar scaleX = `(p-.2391)/.7609` exactly; rail fill = `clamp((vp*7-.5)/6)` exactly (doc formulas confirmed).
- Stage stays pinned (y 0) through 12960.
- Counter text and view title swap on the same frame as the boundary.
Screenshots: p 0 card (384x342) in the centre of cream page with huge dark "BRAND" marquee behind it; p .05 card mid-grow with marquee text still visible at the sides; p .25-.35 blue 3D villa with "Full View" HUD, bottom gradient, 01 counter bottom right; p .5 (Floor) marble-floor part highlighted, other parts faded to ghosts.
