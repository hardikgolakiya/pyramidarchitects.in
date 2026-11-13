# `.ap-transition` (scrub .8, scroll 15390-16200)

1440x900, 21 samples at 5% (40.5 px). 1 timeline unit = 519 px.
| scrollY | cloud0 op / ty | cloud1 op / ty | wash op | copy op / ty |
|---|---|---|---|---|
| 15390 | 0 / 110 | 0 / 90 | 0 | 0 / 36 |
| 15431 | .158 / 75.3 | .263 / -4.8 | 0 | 0 |
| 15471 | .312 / 41.4 | .520 / -97 | 0 | 0 |
| 15512 | .470 / 6.6 | .783 / -192 | 0 | 0 |
| 15552 | .624 / -27.3 | 1 / -270 | 0 | 0 |
| 15593 | .782 / -62 | 1 | 0 | 0 |
| 15633 | .936 / -95.9 | 1 | 0 | 0 |
| 15674 | 1 / -110 | 1 | .157 | 0 |
| 15714 | | | .413 | |
| 15755 | | | .677 | |
| 15795 | | | .933 | |
| 15836 | | | 1 | .064 / 33.7 |
| 15876 | | | | .494 / 18.2 |
| 15917 | | | | .760 / 8.65 |
| 15957 | | | | .902 / 3.5 |
| 15998 | | | | .970 / 1.1 |
| 16038 | | | | .994 / .21 |
| 16079-16200 | | | | 1 / 0 |
Fits: clouds and wash linear (cloud0 duration .5 = 259 px, cloud1 .3 = 156 px, wash starts .5 unit = 260 px, ends 415); copy starts at .85 unit (15831) with `power3.out` (opacity and y use the same curve, finished at 16118). All numbers match the documented timeline (total 1.56 units, 810 px).
Screenshot at ~15836 (tiny, 0.1 scale): almost entirely white with a soft cloud gradient band at the top, no detail readable.
