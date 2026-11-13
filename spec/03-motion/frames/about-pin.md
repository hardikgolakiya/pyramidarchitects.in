# About pin: box travel, tiles out, sentence, slider (scroll 900-3780, scrub .8)

1440x900, pin 2880 px (t units of 900 px). 21 samples at 5% (144 px) and the same step for the whole scene. Box rect = viewport coords (stage is pinned at top 0).

| scrollY | t | box x,y,w,h | radius | tile1 (left) tx / scale | tile6 (right) tx | gallery op | text layer op | word0 ty (px of 65.9 = 110%) | word16 ty |
|---|---|---|---|---|---|---|---|---|---|
| 900 | 0 | 374,216,662,342 | 12 | 0 / 1 | 0 | 1 | 0 | 65.9 | 65.9 |
| 1044 | .16 | 369,213,674,350 | 12 | -354 / .95 | 86 | .36 | 0 | 65.9 | 65.9 |
| 1188 | .32 | 331,191,753,408 | 14 | -691 / .90 | 691 | 0 | 0 | | |
| 1332 | .48 | 228,132,968,565 | 17 | | | | | | |
| 1476 | .64 | 105,62,1225,752 | 22 | | | | | | |
| 1620 | .80 | 54,33,1331,830 | 24 | | | | | | |
| 1764 | .96 | 43,27,1353,846 | 24 | | | | | | |
| 1800-2340 | 1.0-1.6 | 43,27,1354,846 (hold, tiny drift from 2340) | 24 | | | | | | |
| 2484 | 1.76 | 47,31,1332,832 | 24 | | | | .2 | 65.9 | 65.9 |
| 2628 | 1.92 | 71,54,1206,752 | 22 | | | | .733 | 55.97 | 65.9 |
| 2772 | 2.08 | 143,125,818,503 | 17 | | | | 1 | 11.06 | 65.9 |
| 2916 | 2.24 | 231,212,339,197 | 11 | | | | | .69 | 65.9 |
| 3060 | 2.40 | 264,244,166,86 | 9 | | | | | 0 | 55.97 |
| 3204 | 2.56 | 270,251,129,63 | 8 | | | | | | 11.06 |
| 3348 | 2.72 | 271,251,127,61 | 8 | | | | | | .69 |
| 3492-3780 | 2.88-3.2 | 271,251,127,61 (inline slot, 1.7em x .82em at 74.9px) | 8 | | | | | | 0 |

## Interpretation
- Grow: box ends at inset 3%: 43.2,27,1353.6,846 radius 24 at t = 1 (scroll 1800), `power2.inOut` (radius 12 -> 24 follows the same ease).
- Tiles exit: `power2.in` over .2 unit with .03 stagger; tile1 at t=.16 is -354/-691 = .512 = .8^3 (cubic). Gallery autoAlpha 0 by t=.25.
- Hold 1800-2250 (nothing moves), box shrink starts at 2250 (t 1.5), `power3.inOut`, ends t 2.7 (3330) at 127x61, radius 8. Matches doc.
- Text layer: opacity linear 1.7-2.0 (2430-2700); word 0 at t 1.9 (2610); word16 starts 3042 (1.9+16*.03*900=432 px later); all `power3.out`.
- Mobile/tablet differences: see `responsive.md`.

## Slider inside the box (time-based, independent of scroll)
Autoplay `go(1)` every 2.03 s (measured 2025, 2025, 2028 ms between swaps; `setInterval 2000` plus tween scheduling). Order 0,1,2,...,6, forward only. Outgoing slide goes to -30% (`xPercent`) and the incoming starts at +100%: incoming measured 89.5% at t0, 56.5% at +67 ms, 1.7% at +516 ms, 0.5% at +633 ms, 0 at +918 ms (expo.out 1 s). z-index 2 for incoming, 1 for others. Interval kept running through the whole pin (visible region); paused only off screen (IntersectionObserver).

Screenshots: t=0 (y 900) tile collage with 6 photos around a centred rounded box showing slide 0; y 2000 full-bleed photo in the 94% box with two arrow buttons bottom-centre; y 3500 the sentence in two lines with a small rounded photo inline before the first word, a hairline rule and a small copy paragraph under it.
