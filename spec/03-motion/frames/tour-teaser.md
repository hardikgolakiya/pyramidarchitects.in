# `#residence-02-tour` teaser (pin 23130-24030, time-based timeline)

Rest state before the trigger (fresh load, 1440x900): `.tour-box` 893x648 at x 273.5, measured `y=23256` page coordinates (= 23130 + 14% of 900), width 893 (= 62%), height 648 (= 72%), radius 28 (rest), `.tour-inner` scale 1.2 (documented), pieces at yPercent 110.
Time series after the timeline started (t from timeline start; stepped scroll to ~22500 and then a jump to 23200; the series' first frame is already 0.52 s in, the shown "tMs" is relative to my first read, so absolute timeline time = tMs + 520):
| tMs | box x,y,w,h | radius | inner scale | CTA op | hint op | piece0 ty px |
|---|---|---|---|---|---|---|
| 18 | 110,51,1220x799 | 11 | 1.093 | 0 | 0 | 18 |
| 282 | 9,4,1422x892 | 1 | 1.04 | 0 | 0 | 18 |
| 636 | 0,0,1440x900 | 0 | 1.00 | 0 | 0 | 9 |
| 938 | | | | .01 | 0 | 1 |
| 1382 | | | | .98 | 0 | 0 |
| 1646 | | | | 1 | .18 | 0 |
| 1897 | | | | | 1 | |
| 3447 | | | | | 1 | |
| 3931 | | | | | .87 | |
| 4381 | | | | | 0 | |
Fits to the documented timeline (absolute time = tMs + 520):
- Box and inner scale: 0 to 1 s, box `power2.inOut` (w 1220 at t=.54 s, 1422 at .80 s agree with cubic in-out), inner linear 1.2 -> 1.
- Pieces from 1.0 s (`power3.out`, .9 s, .08 stagger), CTA from 1.45 s (.7 s), hint pops in at 2.15 s (`back.out(2)`), fades out at 4.25 s (.4 s). Hint opacity .87 at tMs 3931 (t 4.45 s) and 0 at 4.9 s.
Trigger note: the timeline runs in real time once started and does not reverse. With stepped scrolling (800-900 ms between 100-400 px jumps) it was still unplayed at scroll 22600 and played by 23000, i.e. when the pin begins (23130 minus anticipation). A single big jump (0 -> 21500, or 19000 -> 22500) started it early (box was 1440x900 / mid growth while still ~700-1600 px above the pin start). Treat "start when the stage reaches the top" as the natural-scroll behaviour; fast programmatic jumps trigger it from further away (ScrollTrigger anticipatePin / jump evaluation).
Layout end state: `.tour-box` 0,0,1440x900, radius 0.
