# Hero exit + About lead-in (scroll 0-810, scrub .8)

1440x900, 21 samples at 5% of 810 px (settle 1000 ms). Timeline unit = 810/1.82 = 445 px.

| scrollY | hero wrap scale | hero content y / opacity | cloud0 (front) op / ty | cloud1 (back) op / ty | bg wash op | tile0 (headline) op / ty / scale | box op |
|---|---|---|---|---|---|---|---|
| 0 | 1 | 0 / 1 | 0 / +110 | 0 / +90 | 0 | 0 / 56 / .86 | 0 |
| 41 | 1.02 | -4 / .95 | .184 / 69.5 | .307 / -20.6 | 0 | 0 | 0 |
| 81 | 1.04 | -30.9 / .614 | .364 / 29.9 | .607 / -128 | 0 | 0 | 0 |
| 122 | 1.07 | -80 / 0 | .548 / -10.5 | .913 / -239 | 0 | 0 | 0 |
| 162 | 1.09 | -80 / 0 | .728 / -50.2 | 1 / -270 | 0 | 0 | 0 |
| 203 | 1.11 | | .912 / -90.7 | 1 | 0 | 0 | 0 |
| 243 | 1.12 | | 1 / -110 | 1 | .153 | 0 | 0 |
| 284 | 1.12 | | | | .46 | 0 | 0 |
| 324 | | | | | .76 | 0 | 0 |
| 365 | | | | | 1 | 0 | 0 |
| 405 | | | | | | .527 / 26.5 / .93 | .2 |
| 446 | | | | | | .854 / 8.2 / .98 | .507 |
| 486 | | | | | | .96 / 2.3 / .99 | .807 |
| 527 | | | | | | .992 | 1 |
| 567-810 | | | | | | 1 / 0 / 1 | 1 |

(blank = unchanged from the row above.) Tiles 1..6 follow at +31 px stagger each (tile4 starts rising ~y 490, tile6 reaches op 1 at y 770), last tile finishes at 810.

## Interpretation (all consistent with the doc)
- Hero wrap scale: linear, `1 + .12 * y/222`, complete at y = 222 (doc: 0-222).
- Hero content: eased value measured as cubic (`power2.in` = t^3 in GSAP): y(41)= -4 = -80 * (41/111)^3, opacity 1 - t^3; done at y = 111. y(81) = -30.9 = -80 * .73^3. Doc says `power2.in`: correct (GSAP power2 is cubic).
- Clouds: linear (`ease:none`). cloud1 opacity = y/134 (duration .3 unit = 134 px), cloud0 opacity = y/222.
- Wash: linear 222 to 356.
- Tiles: `expo.out` from 378 px, .55 unit (245 px) each: y405 gives opacity .527 = 1 - 2^(-10*.11).
- Box opacity linear 378 to 512.
- Hero scene itself (scrollY 0 state): wrap 0,0,1440,900 scale 1, content o 1; the load intro (scale 1.08->1) is over by then.

Screenshots: y 0 = hero photo full bleed with serif two-line headline top-left and small meta links; y ~600 = beige cloud band crossing the hero, cream wash rising; y 2000 (about pin, below) = full-bleed carousel photo.
