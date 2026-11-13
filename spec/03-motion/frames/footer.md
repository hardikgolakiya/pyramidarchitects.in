# Footer reveal (`footer#contact`, once at top 82% = scroll 24192)

1440x900. Not fired at scroll 24100 (frame clip `inset(0 100% 0 0)`), fired when jumping to 24250. Time series from the trigger:
| ms | frame clip right inset | rule0 scaleX | reveal0 ty px / op | reveal8 ty / op | reveal16 ty / op |
|---|---|---|---|---|---|
| 12 | 100% | 0 | 22 / 0 | 26.4 / 0 | 22 / 0 |
| 278 | 97.5% | 0 | | | |
| 545 | 64.7% | 0 | | | |
| 795 | 9.88% | .83 | | | |
| 1063 | .12% | 1 | 6.1 / .72 | | |
| 1514 | 0 | 1 | .1 / 1 | 26.4 / 0 | |
| 1778 | 0 | 1 | 0 / 1 | 4 / .21 | 22 / 0 |
| 2914 | 0 | 1 | 0 / 1 | 0 / ~.94 | 0 / 0 |
| 4928 | 0 | 1 | 0 / 1 | 0 / 1 | 0 / 1 |
Fits: frame wipe `power3.inOut` 1.2 s (64.7% at .545 s = 1 - ... matches quartic in-out), rules .55-1.25 s (.83 at .795 s), items from .9 s with .08 stagger (item 8 starts 1.54 s, item 16 at 2.18 s), `expo.out` .9 s. Opacity of the later items stayed slightly below 1 in two mid reads (.94) because the sampler read while the main thread was busy; final all 1. Confirms the doc.
Tablet (768): trigger = top 92%: not fired at 24925, fired by 25025 (clip 0%, rule 1).
