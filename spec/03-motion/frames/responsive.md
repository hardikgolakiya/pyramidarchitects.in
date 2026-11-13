# 768x1024 and 375x812 (25% steps)

Viewport emulation worked this time: `innerWidth` 768 / 375, `devicePixelRatio` 2, page reload after each `resize_window`. (An earlier agent's "stayed at 1440" does not reproduce.) Both widths use the `<1024` (mobile) GSAP branch. Pin lengths scale with viewport height: about +=160%, marquee 920vh, residence-slides +=220%, residence-02 +=500%, tour 100vh.

| | 768x1024 | 375x812 |
|---|---|---|
| about / marquee / rs / ap / r02 / tour / footer tops | 1024 / 3686 / 14131 / 16896 / 17715 / 23859 / 25907 | 812 / 2923 / 11205 / 13398 / 14048 / 18920 / 20544 |
| page height | 26931 | 21356 |
| about section h | 2662 (= 1vh + 160%) | 2111 (= 1vh + 1299) |
| marquee section h | 10445 (1020vh) | 8282 |

## About lead-in (scroll 0 to top-.1vh: 922 / 731)
Timeline identical at 25% steps: hero wrap scale 1 / 1.11 / 1.12; hero content gone by 25%; cloud1 opacity 0 -> 1 by 25%; bg wash 0 -> 1 between 25% and 50%; box opacity 0 / 0 / 1 / 1 / 1 at 25% steps (it starts rising at 47% of the lead-in); tile1 (`hidden lg:block`) stays 0 at all steps (only the headline tile0 animates in: 0, 0, .2, 1, 1 at 768; 0, 0, .204, 1, 1 at 375; the first number in each triple above is tile0, so tile0 = 0,0,.2,1,1 and box = 0,0,1,1,1).

## About pin (mobile branch, scrub .6, 160%)
768: box 77,266,614x389 r12 (slot centre) -> 60,315,445x279 r10 at 25% -> 24,423,69x33 r4 (inline slot) at 50% and held; text layer 0 / 0 / 1 / 1; word0 ty 46 / 46 / 2 / 0. 
375: box 23,195,330x325 -> 23,234,243x231 -> 24,320,48x23 r4; word0 ty 32 / 32 / 1 / 0.
Matches doc: box goes slot -> inline in one power3.inOut tween (1.1 of 1.95 units, finished by ~56%), gallery gone by 25%.

## Marquee (pin 9.2vh: 9421 / 7470 px)
Card at pin start: 768 -> 288x286.7 at (240,368.6); 375 -> 262.5x227.4 at (56.3,292.3) (= `min(70vw,18rem)` x `28vh`). Full-bleed by 12%: 768x1024 / 375x812. HUD opacity at 12%: .906 (768) / .995 (375) (fading in), 1 after. View sequence at 12.5% steps identical to desktop (Full View ... Windows & Doors at 100%).

## residence-slides (pin 220%)
swiper stays in the bottom row, no horizontal hop: 768 x 20, y 517.8, 728x486; 375 x 12, y 412.4, 351x388 at every step (padding p-5 / p-3). Slide 2 text lines (line3) are visible from the 25% sample (state 1 reached before 25% since threshold = 0.36vh).

## ap-transition
768: cloud1 op 0 / 1 / 1 / 1 / 1, wash 0 / 0 / .936 / 1 / 1, copy 0 / 0 / 0 / .971 / 1 (25% steps). 375: same (wash .937, copy .969).

## residence-02 (mobile slots)
768 (pin offsets 0/460/1000/2100/3200/4300/5000): hero image full, title in at 1000, state 1 at 2100 (main `4,3,92,50`; next `74,84,22,12` op .901), state 2 at 3200 (prev `4,84,22,12`, main `4,3,92,50`, next `74,84,22,12` op 1), state 3 at 4300 (img0 op 0). 375: identical sequence at 0/700/1700/2600/3500/4000. All slots match `SLOTS.mobile`. Label opacity 1 from state 1 (the label is `hidden lg:flex` only in layout; its opacity still tweens).

## Tour teaser
Rest rect 768: x 30.7, w 706.6, h 716.8 (= 92% x 70%), top at 12%; end 0,0,768x1024. 375: 15,517.4,345x568.4 at scroll 18500 (before pin; = 4% left, 92%x70%); end 0,0,375x812.

## Footer
Trigger top 92%: 768 not fired at 24925, fired by 25025.
