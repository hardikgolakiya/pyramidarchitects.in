# `#residence-02` (pin 17730-22230)

## A. Intro scrub (pin offset 0-900), 21 samples at 5%
| scrollY | clip-path inset top/bottom | left/right | radius px | inner0 scale | stage bg |
|---|---|---|---|---|---|
| 17730 | 24% | 32% | 28 | 1.30 | 255,255,255 |
| 17775 | 23.988 | 31.984 | 27.99 | 1.30 | |
| 17820 | 23.904 | 31.872 | 27.89 | 1.30 | |
| 17910 | 23.232 | 30.976 | 27.10 | 1.29 | |
| 18000 | 21.408 | 28.544 | 24.98 | 1.27 | |
| 18090 | 17.856 | 23.808 | 20.83 | 1.22 | |
| 18180 (50%) | 12 | 16 | 14 | 1.15 | |
| 18270 | 6.144 | 8.192 | 7.17 | 1.08 | 255,255,255 |
| 18315 | 4.116 | 5.488 | 4.80 | 1.05 | 253,252,250 |
| 18405 | 1.5 | 2 | 1.75 | 1.02 | 248,246,240 |
| 18495 | .324 | .432 | .38 | 1.00 | 244,239,229 |
| 18585 | .012 | .016 | .01 | 1.00 | 239,233,219 |
| 18630 | 0 | 0 | 0 | 1.00 | 237,230,214 (#EDE6D6) |
Fits: clip-path and radius = `power2.inOut` over 900 px (half-way value exactly midpoint); inner scale 1.3 -> 1 with `power2.inOut` start/linear-looking tail (1.15 at 50%); bg colour linear from t=.6 (18270) to 1.0 (18630), 255 -> 237 in R (linear). Documented values confirmed. The photo is full-bleed (stage 1440x900, `.ap-img` 1440x900).

## B. State machine thresholds (pin offsets in px; ascending scroll, 2.1 s settle)
Image rects below are `left,top,w,h` in % of stage | opacity | z-index | inner scale.
| offset | i (% vh) | state | img0 | img1 | img2 | hero piece0 / piece0 / piece5 / piece10 (yPercent/op) | label op | count col ty |
|---|---|---|---|---|---|---|---|---|
| 700, 800 | 78, 89 | -1 | 0,0,100,100 o1 z3 s1 (clip full) | wait 74,78.6,8.6,18 o0 | wait o0 | 110/0 everywhere | 0 | 0 |
| 820, 1700 | 91-189 | 0 | same | same | same | hero 0/1 | 0 | 0 |
| 1780-2700 | 198-300 | 1 | main 27,3.4,45,93.2 o1 s1 | next 74,78.6,8.6,18 o .9 (!) z3 s1.2 | wait o0 | hero -110/0; piece0 0/1 | 1 | 0 |
| 2770-3700 | 308-411 | 2 | prev 16.6,3.4,8.6,18 o1 s1.2 | main 27,3.4,45,93.2 o1 s1 | next 74,78.6,8.6,18 o1 z3 | piece0 -110/0; piece5 0/1 | 1 | -15.4 |
| 3760-4500 | 418-500 | 3 | out 16.6,3.4,8.6,18 o0 | prev o1 s1.2 | main 27,3.4,45,93.2 o1 z3 s1 | piece5 -110/0; piece10 0/1 | 1 | -30.8 |
Thresholds bracketed: hero piece appears between offset 800 (i 88.9) and 820 (i 91) -> doc i = 90 correct; state 1 between 1700 and 1780 (doc 196); state 2 between 2700 and 2770 (doc 306); state 3 between 3700 and 3760 (doc 416). All consistent.
Count column: one step = 15.4 px = 1.4em at 11 px (= 33.3% of the 46.2 px column), matches `yPercent -(100/3)*(e-1)`.

## Observations
- In state 1 the NEXT thumbnail (img1) rests at opacity 0.9, not 1: the `wait -> next` tween starts at t+.6 with .9 s duration, but the `s1` label is at t+1.2, so `tweenTo('s1')` stops 0.3 s early (power3.inOut value .9). Same on phone widths. A rebuild using plain label ends would show 0.9 too; use `1` if you want clean thumbnails.
- `.ap-piece` count is 15 (5 per room), not 4.
- Mobile slots (<1024, 768 and 375 widths): main `4,3,92,50`, prev `4,84,22,12`, next `74,84,22,12` (percent of stage) exactly as documented; thresholds scale with viewport height (offset = i * vh/100).
- Time-based hops not frame-sampled (see README).
Screenshots: offset 0 white stage with a small centred rounded window; mid intro the room photo expanding; offset 1780 room-1 text on the right, photo card centred, "Inside the ..." label with counter bottom-left.
