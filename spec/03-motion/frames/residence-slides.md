# `#residence-slides` (pin 13860-15840, 220% = 1980 px)

1440x900. Time-based state machine; samples at pin offsets with 1.5-1.8 s settle.

## Intro (once, trigger: stage top at 75% of viewport = scroll 13185)
Pre-trigger (scroll 12990) state: swiper below (yPercent 105), img0 scale 1.25, img1 scale 1.35 translated +15% (125.4 px of 836), item1 at -100% (-836 px), lines yPercent 110 (66.2 px), line opacity 0. After jumping to 13230 (swiper final y 662 = stage top 630 + 32 px padding):
| ms after scroll | swiper y (viewport px) | img0 scale | line0 ty px |
|---|---|---|---|
| 156 | 1060.6 | 1.15 | 66.2 |
| 307 | 853.7 | 1.09 | 66.2 |
| 457 | 740.7 | 1.06 | 35.0 |
| 607 | 687 | 1.03 | 13.0 |
| 757 | 667 | 1.02 | 3.4 |
| 924 | 662.2 | 1.01 | .35 |
| 1074 | 662 | 1.00 | 0 |
Matches `power3.out` 1.1 s (swiper, with .12 s delay), scale 1.6 s, lines from .5 s.

## State thresholds
| pin offset px | swiper x (viewport) | swiper translate | item0 ty | item1 ty | img0 scale/ty | img1 scale/ty | state |
|---|---|---|---|---|---|---|---|
| 0 / 99 / 300 | 726 | 0 | 0 | -836 | 1 / 0 | 1.35 / +125.4 | 0 |
| 330 / 400 / 792 | 32 | -694 | +836 | 0 | 1.35 / -125.4 | 1 / 0 | 1 |
Threshold lies between 300 and 330 px (doc: 324 = progress .1636). State 1 stays unchanged through the end of the pin (also checked 14850, 15345, 15840).

## Swap curve (time-based, scroll jumped from 14100 to 14300)
Swiper x after the scroll event: 726 (0 ms), 721.7 (144), 692.9 (243), 599 (343), 379 (444), 159 (544), 65 (644), 32.1 (844), 32 (1194). `power3.inOut` over .9 s, centre point at 445 ms; it begins within one frame of the scroll event and is independent of scroll speed. Scrolling back below 324 px reverses the same timeline (images restored to scale 1.35/1.31 in the first 700 ms; end state identical to the initial state).

Interpolation summary: intro = `power3.out`; swap = `power3.inOut` x-hop (.9 s), image slide `power3.inOut` .8 s, image inner scale `power2.out/in` .8-.9 s, text card `power3.inOut` .9 s, lines `power3.out` .5 s stagger .06 from .5 s. Not captured frame by frame (see README).
