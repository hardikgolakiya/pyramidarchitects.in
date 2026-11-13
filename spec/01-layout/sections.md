# `/` sections, in DOM order (inside `<main id="top" class="overflow-x-clip">`)

Notation: `lg` = >=1024, `md` = >=768, `LS` = short landscape phone override. Sizes measured at 1440x900 unless stated. "Pin" = GSAP pin / sticky stage. Copy is placeholder-able: slots are named by role. Initial states with `opacity-0` / `visibility:hidden` are animation start states (motion agent owns the tweens).

Order and anchors:
1. Hero (no id, `sticky`) 2. `#about` 3. `#marquee-transition` 4. `#residence-slides` 5. `.ap-transition` (no id) 6. `#residence-02` 7. `#residence-02-tour` 8. `footer#contact`.
(Nav and loader sit outside `<main>`.)

---
## 1. HERO
```
section.sticky.top-0.z-0.h-[100svh].min-h-[100svh].w-full.overflow-hidden.bg-black.text-white.lg:h-screen.lg:min-h-screen.select-none
 div.hero-image-wrap.absolute.inset-0.pointer-events-none
   img.hero-image.h-full.w-full.object-cover        (full-bleed photo, preloaded/priority)
   div.absolute.inset-0.bg-black/35                  (35% black scrim)
 div.hero-content.pointer-events-auto.absolute.inset-0.z-10
   div.absolute.left-6.top-[16%].md:left-10.lg:left-10.lg:top-[7%]   LS:top-[18%]      <- title block
     h1.hero-title-line.font-serif (Instrument Serif)  "Line1,<br>Line2."
        text-[clamp(2.75rem,12vw,4.5rem)] md:text-[5rem] lg:text-[5.64rem] LS:text-[2.25rem], leading-[94%]
        measured fs: 45px @375 | 80px @768 | 90.24px @>=1024 ; box 433x186 @1440 (x40,y63)
     div.hero-actions.mt-4.flex.flex-col.gap-0.sm:flex-row.sm:flex-wrap.sm:gap-5   LS: mt-2 flex-row gap-5
        a.group.flex.items-center.gap-3.py-1.5.text-sm.uppercase.md:text-base.lg:py-0.lg:text-lg  LS:text-xs
           span[data-hover-reveal].border-b.border-white  "CTA 1 label"  + span "→" (translate-x-1 on hover, 300ms)
        a (same)  "CTA 2 label"  (href #residence-02-tour)  CTA1 href #marquee-transition
   div.hero-meta.pointer-events-none.absolute.bottom-[13%].left-0.right-0.px-6.md:px-10.lg:inset-0.lg:flex.lg:items-center.lg:px-10   LS:bottom-14
      div.hero-meta-inner.grid.w-full.grid-cols-2.gap-x-6.gap-y-1  md:flex md:items-end md:justify-between md:gap-0  (LS also flex)
         4x p[data-reveal-01=chars].text-[11px].uppercase.tracking-[0.18em]  md:text-sm lg:text-lg LS:text-[10px]   ("Featured Residence","Private Residence","2026","Explore")
   div.hero-bottom.absolute.bottom-6.w-full.px-6.text-center.md:bottom-7   LS:bottom-3
      p[data-reveal-01=chars].text-sm.leading-[120%].md:text-base.lg:text-lg  two-line tagline (br)
```
Behaviour: sticky `top:0` -> stays in place while `#about` (z-20, relative) scrolls up over it. Height = 100svh (100vh at lg). 
Layout per width:
- **375**: h1 (x24,y130, 182x93); actions stacked column (2 rows of 33px) at y231; meta = 2x2 grid at bottom 13% (y669, text 11px, col gap 24); tagline centered at bottom 24px (y754, 14px).
- **768**: h1 x40,y164 (80px); actions in a row gap 20px at y350; meta flex row space-between at y871 (14px); tagline bottom 28px.
- **>=1024**: h1 top 7% (y54-63), x40; meta row is vertically **centered** in the hero (`lg:inset-0 lg:flex lg:items-center`, 18px caps text, y436 @900) spanning full width minus 40px gutters, items spaced between; tagline 18px bottom 24px (`bottom-6` / md `bottom-7`=28px).

---
## 2. `#about` (the "gallery -> image box -> inline text" scroll scene)
```
section#about.relative.z-20.overflow-x-clip.bg-[#EDE6D6].text-[#2A2725]   total 3780 @1440 (900 stage + 2880 pin)
 div[aria-hidden].pointer-events-none.absolute.left-0.top-[-42vh].md:top-[-52vh].z-30.h-[112vh].w-full     <- clouds layer
    img.about-cloud x2 (cloud-1-cropped-beige: top-[25%] lg:top-0 ; cloud-2-full-beige: top-[20%] lg:top-[8%]) left-0 w-full h-auto max-w-none opacity-0
 div.about-bg.pointer-events-none.absolute.inset-x-0.bottom-0.top-[-40vh].z-[35].bg-[#EDE6D6].opacity-0
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 0%, .25 15%, .6 30%, .9 42%, #000 50%)   <- soft fade-in wash over the hero
 [pin-spacer z40]
  div.about-stage.relative.z-40.h-[100svh].w-full.overflow-hidden.lg:h-screen
    div.about-slot-center (invisible measuring box, the box's resting rect):
        mobile  left-[6%]  top-[24%] w-[88%] h-[40%]      (375: x23 y195 330x325)
        md      left-[10%] top-[26%] w-[80%] h-[38%]      (768: x77 y266 614x389)
        lg      left-[26%] top-[24%] w-[46%] h-[38%]      (1440: x374 y216 662x342 ; 1024: x266 y184 471x292)
        LS      left-[15%] top-[25%] w-[70%] h-[60%]
    div.about-gallery.absolute.inset-0
        p.about-tile (headline "A quieter way to live"): font-serif text-3xl leading-tight text-center
              mobile/tablet: absolute inset-x-0 top-[12%] px-6 ; lg: left-[26%] top-0 w-[20%] px-0 text-[3.5vw]  (1440 -> 50.4px, box x395 y65 248x108)  LS: top-[13%] text-2xl
        6x div.about-tile.absolute.hidden.overflow-hidden.rounded-xl.lg:block (images; ONLY >=1024; rotated via inline style rotate):
           L1 left-[-1%] top-[14%] w-[26%] h-[43%] rot -4deg   (patio)
           L2 left-[2%]  top-[61%] w-[20%] h-[22%] rot  3deg   (living)
           L3 left-[25%] top-[70%] w-[22%] h-[26%] rot -2deg   (kitchen)
           R1 left-[51%] top-[1%]  w-[16%] h-[21%] rot -6deg   (exterior)
           R2 left-[73%] top-[15%] w-[27%] h-[29%] rot  8deg   (aerial)
           R3 left-[74%] top-[54%] w-[25%] h-[39%] rot -4deg   (night)
           (classes about-tile-l / about-tile-r = which side they exit to: L -> left offscreen, R -> right)
    div.about-text-layer.absolute.inset-0.flex.items-center.px-6.lg:px-10.opacity-0
        div.grid.w-full.grid-cols-12.gap-4.lg:gap-6
          div.col-span-12.lg:col-span-2 (LS:col-span-2) > div.text-[10px].uppercase.tracking-[0.18em]  "About" label
          div.col-span-12.lg:col-span-10 (LS:col-span-10)
             p.font-sans.text-[clamp(1.75rem,7vw,2.5rem)].leading-[1.05].tracking-[-0.045em].lg:text-[5.2vw].lg:leading-[80%]  LS:text-[1.75rem]
                span.about-slot-inline.inline-block.h-[0.82em].w-[1.7em].mb-[0.14em].mr-[0.18em].align-bottom   <- inline hole where the image box lands
                N x span.inline-block.overflow-hidden.align-bottom.mr-[0.25em].-mt-[1em].-mb-[0.1em].pt-[0.1em].pb-[0.2em] > span.about-word.inline-block   (word-by-word mask reveal)
             div.about-rule.mt-4.h-px.w-full.bg-[#2A2725].lg:mt-6   LS:mt-3   (scaleX 0->1 from centre in JS)
             p.about-supporting-copy.mt-4.max-w-[350px].text-sm.leading-[1.35].tracking-[-0.01em].opacity-0.lg:mt-6.lg:text-lg  LS: mt-2 max-w-[420px] text-xs
    div.about-box.absolute.left-0.top-0.z-50.overflow-hidden.rounded-xl.opacity-0     <- the morphing frame (position/size set by JS)
        7x img.about-slide.absolute.inset-0.h-full.w-full.object-cover  (crossfade carousel)
        div.about-arrows.absolute.bottom-4.left-1/2.z-10.flex.-translate-x-1/2.gap-3  (LS bottom-2)
            2x button.h-10.w-10 (LS h-8 w-8).rounded-full.bg-[#EDE6D6].text-[#2A2725] with chevron svg, hover:scale-105, aria-labels Previous/Next
```
Measured states (1440x900, scroll relative to about top): 
- start: box = slot-center (x374 y216 662x342), tiles around it scattered as above (their visible bounds slightly shifted by rotation); title at y65.
- ~1400px in: box expands to nearly full-bleed **x43 y27 1354x846** (3% x 3% inset, radius 12px); tiles flown out (L tiles x<-300, R tiles x>1429); arrows fade in at bottom (y817).
- end: box shrinks to the inline slot (x271 y251 127x61 = 1.7em x 0.82em at 74.88px); text layer visible; paragraph 1129px wide starts at x271 (col 3..12 of the 12-col grid); rule 1129px wide at y527; supporting copy y552 w350.
- Text block geometry @1440: grid x40 w1360 (gap 24), left label col = 2/12, text col x271 w1129; paragraph font 5.2vw = 74.88px, line-height 80% (59.9px), tracking -0.045em.
- Mobile/tablet: no tiles (hidden below lg), title "top-[12%]" centered, box rests at slot-center (88% x 40% of viewport) -> grows to full-screen inset -> shrinks to inline slot (375: 48x23).
Stage height 100svh (lg: 100vh); section total = stage + pin (1.6vh <1024, 3.2vh >=1024).

---
## 3. `#marquee-transition` ("Scroll to enter" marquee -> 3D model viewer)
```
section#marquee-transition.relative.bg-[#EDE6D6].text-[#2A2725]  style="height:1020vh"   (9180 @900, 10445 @1024 tall, 8282 @812)
 [pin-spacer: padding-bottom 9.2vh]
 div.marquee-stage.relative.h-screen.w-full.overflow-hidden
   div.pointer-events-none.absolute.inset-0.z-10.flex.items-center.overflow-hidden          <- marquee rail
      div.marquee-track.flex.whitespace-nowrap.font-sans.font-medium.leading-none.tracking-[-0.07em]
           text-[clamp(2.5rem,10vw,8rem)]  lg:text-[clamp(3.5rem,7.5vw,8rem)]
           3 x div.flex.shrink-0 > 8 x span.mx-[0.2em] "BRAND WORDMARK"   (24 repeats; one span 528x108 @1440 (108px = 7.5vw), 196x40 @375, 376x77 @768/1024)
   div.marquee-canvas.pointer-events-none.absolute.left-1/2.top-1/2.z-40.-translate-x-1/2.-translate-y-1/2.overflow-hidden.rounded-sm
           h-[28vh] w-[min(70vw,18rem)]  lg:h-[38vh] lg:w-[min(72vw,24rem)]          <- the image "window"; JS grows it to 100% x 100% (rect 384x342 @1440 -> 1440x900)
   div.marquee-prompt.absolute.bottom-8.left-1/2.z-30.-translate-x-1/2.text-[10px].uppercase.tracking-[0.2em].text-black/55   "Scroll to enter"
   div.absolute.inset-0.z-[30].overflow-hidden.bg-blue-900.transition-opacity.duration-700.pointer-events-none.opacity-0     <- 3D viewer layer (fades in at end)
       div(relative 100%x100%) > div > canvas (three.js, fills layer)
       RAIL (part selector): div.absolute.right-4.top-[38%].-translate-y-1/2.scale-90 ; lg:right-10 lg:top-1/2 lg:scale-100
            div.relative.flex.flex-col.items-center.gap-4 : 1px track line (bg-white/20) + 1px progress line (scaleY) + 7 x button.h-5.w-5 (dot span: active h-3.5 w-3.5 ring-4 ring-white/20 ; idle h-2 w-2 border-white/40) + hint bubble `.rail-hint` (h-9 w-9 white circle) at -right-4
            1440: x1380 y342 20x236 (right 40px, vertically centred)  |  375: x340 y202 (right 16px, 38%)
       div.absolute.inset-x-0.bottom-24.z-10.hidden.lg:flex.justify-center > .rotate-hint (48px circle + "Drag to rotate" 10px caps)  (lg only)
       HUD: div.absolute.inset-x-0.bottom-0.z-10.bg-gradient-to-t.from-black/60.via-black/25.to-transparent.px-6.pb-6.pt-20.lg:px-10.lg:pb-8.lg:pt-28.text-white
            1440: x0 y619 1440x291
            div.flex.flex-col.gap-4.sm:flex-row.sm:items-end.sm:justify-between.sm:gap-6
               left (min-w-0 pr-10 lg:pr-0): eyebrow row (h-px w-6 line + "Structure" 10px caps tracking .2em), then h3 (text-3xl md:text-4xl lg:text-6xl, tracking -0.04em) and caption p (text-xs md:text-sm uppercase tracking-[0.14em] white/75, max-w-md)
               right (shrink-0 text-right): big counter "01" (text-4xl md:text-5xl lg:text-8xl tracking-[-0.05em] tabular-nums) + "of 07" 10px caps
            progress bar: div.relative.mt-6.h-[2px].w-full.bg-white/25 with 6 tick marks at 14.2857% steps (h-2 w-px bg-white/50) + fill (scaleX) + 10px knob (h-2.5 w-2.5 rounded-full, glow)
```
Scroll beats (1440x900, offsets from section top 4680): at pre-pin the marquee track sits at y≈776 (vertically centred in the stage, 108px tall) with the image window (384x342) centred at x528; as you scroll the track translates left (13720px wide), the window grows to full-viewport, then the blue-900 3D layer fades in (700ms) and the part-selector/HUD appear; section end releases at +8280.
Mobile 375: window `min(70vw,18rem)`=263 x `28vh`=227; track font 40px (10vw -> clamped min 2.5rem); rail scaled 0.9; no "Drag to rotate" hint; HUD h3 text-3xl (30px), counter text-4xl, padding px-6 pb-6 pt-20.
Tablet 768: window 288x287 (28vh of 1024); track 76.8px (10vw); HUD h3 md:text-4xl, counter md:text-5xl.
1024x768: window 384x292 (38vh), track 76.8px (7.5vw).

---
## 4. `#residence-slides` (two stacked cards, swiper wipe)
```
section#residence-slides.relative.z-20.w-full.bg-[#EDE6D6].text-[#2A2725]          2880 @1440 (900 + 1980)
 div.rs-stage.relative.h-screen.w-full.overflow-hidden.p-3.md:p-5.lg:p-8   LS:p-3        <- 12 / 20 / 32 px page inset
   div.relative.h-full.w-full                                            (1440: x32 y32 1376x836)
     2 x div.rs-slide.pointer-events-none.absolute.inset-0.grid.grid-rows-2.gap-3.lg:grid-cols-2.lg:grid-rows-1   LS: grid-cols-2 grid-rows-1   (z-index 1 / 2 inline)
         div.rs-text.pointer-events-auto.relative.flex.flex-col.justify-between.overflow-hidden
              rounded-[28px] md:rounded-[36px] LS:rounded-[20px]  p-5 md:p-8 lg:p-10 LS:p-4
              slide A: lg:col-start-1  bg #2A2725 text white (inline style) ; slide B: lg:col-start-2  bg #ffffff text #2A2725
              h2.font-sans.text-[clamp(2rem,8vw,3.75rem)].leading-[0.95].tracking-[-0.04em].lg:text-[4.4vw]  LS:text-[3.4vw]   3 lines each wrapped in span.block.overflow-hidden (-mt-[0.05em] -mb-[0.15em] pt-[0.05em] pb-[0.15em]) > span.rs-line.block
              div.flex.items-end.justify-between.gap-6 (LS gap-3):
                  div.rs-counter.flex.shrink-0.-space-x-px.text-sm : 2 overlapping circles span.flex.h-12.w-12 (md:h-14 md:w-14, LS h-9 w-9).rounded-full.border.border-current ("01" / "02", inactive opacity-40)
                  p.rs-copy.max-w-[22rem].text-xs.leading-[1.4].tracking-[-0.01em].md:text-base  LS: max-w-[14rem] text-[10px]
     div.rs-swiper.absolute.inset-x-0.bottom-0.isolate.z-50.overflow-hidden.rounded-[28px].md:rounded-[36px]      <- the photo panel
            mobile/tablet: h-[calc(50%-6px)] full width at bottom ; lg & LS: inset-y-0 h-auto w-[calc(50%-6px)] left-auto right-0 ; LS rounded-[20px]
         2 x div.rs-swiper-item.absolute.inset-0.overflow-hidden (z 1/2) > img.rs-img.h-full.w-full.object-cover.will-change-transform
```
Geometry @1440x900: stage pad 32 -> content 1376x836; each card slot = 682 wide (50% - 6px gap), text card x32 w682, photo x726 w682; text padding 40; h2 63.36px (4.4vw), 3 lines in a 602-wide column; counter 111x56 at bottom-left (x72,y772), copy 352 wide x67 bottom-right (x322).
@1024x768: padding 32; cards 474x704; h2 45px.
@768x1024: padding 20; stacked: text card 728x486 (top, rounded 36), photo 728x486 (bottom); gap 12; h2 60px; padding 32.
@375x812: padding 12; text card 351x388 (rounded 28, p-5=20px), photo 351x388 below at y413; h2 32px.
Slide B card is parked below (y+gap offscreen) and rises as page scrolls; second photo wipes over first (JS).

---
## 5. `.ap-transition` ("Not every space needs to be grand" cloud transition villa -> apartment)
```
section.ap-transition.relative.z-30.-mt-[50vh].w-full.overflow-x-clip.bg-white.text-[#2A2725]
     height: h-[var(--h-m)] lg:h-[var(--h-d)] with style --h-d:160vh; --h-m:80vh     (1440: 1440px; 1024: 1229; 768x1024: 819; 375x812: 650)
 div.ap-transition-wash.pointer-events-none.absolute.inset-x-0.bottom-0.top-[-40vh].z-[35].bg-white.opacity-0   (same gradient mask as .about-bg)
 div[aria-hidden].pointer-events-none.absolute.left-0.top-[-42vh].md:top-[-52vh].z-30.h-[112vh].w-full   <- clouds (non-beige versions cloud-1-cropped / cloud-2-full; same tops as about clouds)
 div.sticky.top-0.z-40.flex.h-[100svh].w-full.items-center.justify-center.px-6.lg:h-screen
    div.ap-transition-copy.flex.flex-col.items-center.text-center.opacity-0
       p.mb-4.text-[10px].uppercase.tracking-[0.24em].lg:mb-5.lg:text-xs   "Residence 02" eyebrow
       h2.ap-transition-heading.font-serif.max-w-[15ch].leading-[94%].text-[clamp(2.25rem,9vw,8rem)]   "Line1<br>Line2" (1440: 128px, 791x241, x325; 1024: 92px; 768: 69px; 375: 36px, 223x68)
```
Overlap: `-mt-[50vh]` pulls this section up so its top 50vh overlaps the end of `#residence-slides`' pin; white wash + clouds sweep over the slides (white bg) then heading is held centred by `sticky` for (section height - 100vh) = 60vh (lg) / -20..0 (mobile 80vh-100vh<0 => no hold).

---
## 6. `#residence-02` (apartment photo stage, 3 rooms)
```
section#residence-02.relative.z-30.w-full.bg-[#EDE6D6].text-[#2A2725]      5400 @1440 (900 + 4500)
 div.ap-stage.relative.h-screen.w-full.overflow-hidden.bg-white
   div.absolute.inset-0
     3 x div.ap-img.absolute.overflow-hidden > img.ap-img-inner.h-full.w-full.object-cover.will-change-transform (object-position 50% 50% / 50% / 45% 50%)
         z 3 (living room, full-bleed at start), 2, 1 ; JS animates each from full-bleed to a centred/offset frame and thumbnails
         thumb stack rest rect: 1440: x1066 y707 124x162 ; 1024: x758 y604 88x138 ; 768: x568 y860 169x123 ; 375: x278 y682 83x97
         mid-state of img 1: centred portrait frame 648x839 at x389 y31 (1440)
     div.absolute.inset-x-0.bottom-0.z-20.flex.flex-col.gap-4.p-6.text-white.md:p-8.lg:gap-5.lg:p-12   LS gap-2 p-6     <- hero caption (x48..1392 @1440; y579..900)
         span.mask > p.ap-hero-piece.text-[10px].uppercase.tracking-[0.2em]  "Residence 02"
         h2.font-sans.text-[clamp(2.75rem,12vw,5.5rem)].leading-[0.92].tracking-[-0.05em].lg:text-[7vw]  LS:7vw   2 lines (1440: 100.8px, 1344x190)
     div.absolute (text panel)   mobile: bottom-[16%] left-[6%] right-[6%] top-[56%] ; lg: bottom-[24%] left-[74%] right-[3%] top-[18%] ; LS: bottom-[14%] left-[73%] right-[3%] top-[12%]
         3 x div.ap-text.absolute.inset-0.flex.flex-col.justify-center.gap-3.lg:gap-5  (LS gap-2)  (stacked, crossfaded by scroll)
             p.ap-piece 10px caps tracking .2em (eyebrow) ; h2 text-[clamp(1.75rem,6.5vw,2.75rem)] leading-[0.98] tracking-[-0.04em] lg:text-[2.8vw] ; p.max-w-[24rem].text-xs.leading-[1.5].md:text-sm ; p 10px caps tracking .16em opacity-70 (features list)
             1440: panel x1066 y162 331x522 ; h2 40.3px ; 1024: x758 y139 236x445 ; 768: x46 y573 676x287 ; 375: x23 y455 330x227
     div.ap-label.absolute.bottom-[3.4%].left-[2.6%].z-20.hidden.items-center.gap-4.text-[11px].uppercase.tracking-[0.18em].lg:flex (LS:flex)  "Inside the apartment  [01|02|03 odometer column] / 03"   (1440: x37 y853 219x17; not rendered below lg)
```
All text lines use the mask pattern `span.block.overflow-hidden.-mt-[0.05em].-mb-[0.18em].pt-[0.05em].pb-[0.18em] > .ap-piece.block`.

---
## 7. `#residence-02-tour` (image box expanding to full screen, CTA into /tour)
```
section#residence-02-tour.relative.z-30.w-full.bg-[#EDE6D6].text-white       1800 @1440 (900 + 900)
 div.tour-stage.relative.h-screen.w-full.overflow-hidden.bg-[#EDE6D6]
   div.tour-box.absolute.overflow-hidden.rounded-[28px]
        rest: left-[4%] top-[12%] h-[70%] w-[92%]  ;  lg: left-[19%] top-[14%] h-[72%] w-[62%]       (1440 rest = x274 y126 893x648 ; 375: x15 y97 345x568 ; 768: x31 y123 707x717 ; 1024: x195 y108 635x553)
        JS grows it to inset 0 (full 1440x900) as the pin starts, radius -> 0
      img.tour-inner.h-full.w-full.object-cover.will-change-transform
      div.absolute.inset-0.top-8.flex.flex-col.justify-between.p-6.md:p-10          (overlay UI; "top-8" offset => starts 32px down)
         row: div.flex.items-start.justify-between.gap-6
               span.mask > p.tour-piece.text-xs.uppercase.tracking-[0.2em]  "Explore Residence 02" (eyebrow)
               div.hidden.lg:block > ul.tour-piece.flex.items-center.gap-6.text-[10px].uppercase.tracking-[0.18em] aria-label "Walkthrough controls": 3 x li.flex.items-center.gap-2.5 > span.flex.gap-1 > kbd.inline-flex.h-7.min-w-7.rounded-md.border.border-white/70.px-1.5.text-[11px] (W A S D | E | Q) + label (Move / Interact / Customize)
         bottom: div.flex.flex-col.gap-6.lg:flex-row.lg:items-end.lg:justify-between.lg:gap-10
               h2.font-sans.text-[clamp(2.75rem,12vw,5.5rem)].leading-[0.9].tracking-[-0.05em].lg:text-[7.5vw]  "Step inside."  (1440: 108px)
               div.flex.max-w-md.flex-col.items-start.gap-5 : p.text-xs.leading-[1.5].md:text-sm (intro) + div.relative > a.tour-fade.inline-block.rounded-full.border.border-white/70.px-6.py-3.text-[11px].uppercase.tracking-[0.18em].hover:bg-white.hover:text-[#2A2725]  "Enter Residence 02 →" (href /tour, 206x43)  + span.tour-hint (36px white circle w/ icon, absolute right-4 top-4, pulse ring)
```
At pin start the box is already full-bleed (x0 y0 1440x900), then holds for 900px of scroll, CTA fades in (`tour-fade`, opacity 0 initially).

---
## 8. `footer#contact`
```
footer#contact.relative.z-30.flex.min-h-[100svh].w-full.flex-col.bg-[#EDE6D6].px-4.pb-[max(1rem,env(safe-area-inset-bottom))].pt-4.text-[#2A2725]
        md:px-10 md:py-6  lg:block lg:h-screen lg:py-16   LS: px-4 pb-3 pt-3
 div.footer-frame.flex.flex-1.flex-col.justify-between.rounded-[20px].border.border-[#2A2725]/20.px-5.py-6.md:rounded-[30px].md:px-10.md:py-10.lg:block   LS: rounded-[20px] px-5 py-3
   row A: div.flex.items-start.justify-between.gap-8.text-xs.uppercase.tracking-[0.12em].md:text-sm : a "Wordmark" (font-semibold tracking-[0.08em]) | span.hidden.md:block.text-right "Tagline"  (each in div.overflow-hidden, .footer-reveal)
   div.footer-rule.my-8.h-px.origin-left.scale-x-0.bg-[#2A2725]/20.md:my-16   LS:my-3   (scaleX -> 1)
   div.grid.gap-10.lg:grid-cols-[1fr_auto].lg:gap-16   LS: grid-cols-[1fr_auto] gap-8
      col 1: h2.footer-reveal.max-w-[12ch].font-serif.leading-[0.88].tracking-[-0.03em].text-[clamp(3rem,13vw,7rem)] lg:text-[clamp(2.75rem,8vw,7rem)] LS:text-[2.5rem]   + p.mt-6.max-w-xl.text-lg.leading-[1.2].md:text-xl LS: mt-2 text-sm
      col 2: div.grid.grid-cols-2.gap-8.text-sm.md:gap-12.lg:min-w-[360px].lg:gap-20.lg:text-base   LS: min-w-[260px] gap-10 text-xs
          two columns (flex flex-col gap-4): heading p.text-xs.uppercase.tracking-[0.12em].text-[#2A2725]/65 ("Explore" / "Follow") + links (block py-1 lg:py-0, hover:opacity-60): Explore -> 2 anchors (#residence-slides, #residence-02); Follow -> 4 external links + "Contact" button
   div.footer-rule (same)
   row C: div.flex.flex-col.gap-4.text-xs.uppercase.tracking-[0.12em].lg:flex-row.lg:items-center.lg:justify-between.lg:text-sm   LS: flex-row items-center justify-between gap-3 text-[11px]
          left: copyright line + sub-line (text-[10px] md:text-[11px] tracking-[0.12em] 55% opacity)
          middle: button "Open to work" with status dot (h-2 w-2 rounded-full bg-[#3FA85B] + animate-ping ring)
          right: a "Back to top" -> #top
```
Measured: 1440x900: footer = 900 (lg:h-screen); frame x40 y64 1360x647 (py-16=64 outer, md:px-10=40, inner padding 40 => content x81..1359); title row y105 h20; rule y189 (my-16 = 64); h2 112px (clamp max 7rem) at y471 (x81, 618 wide); link columns grid 360 wide x245 tall at x999 y254 (col widths 140 + gap 80 + 140); second rule y563; bottom row y628 h42 -> `lg:block` means blocks stack from top, NOT vertically distributed.
1024x768: frame x40 y64 944x618; h2 82px (8vw); link grid x583.
768x1024: footer 1024 (min-h-100svh, flex col) frame x40 y24 688x976 (md:py-6 outer, flex-1, justify-between distributes rows); h2 99.84 (13vw); links grid below the heading (single column grid, gap-10), rows spread.
375x812: footer 812; padding 16; frame x16 y16 343x780 (radius 20, p 20/24); title row hides tagline (md:block); h2 48.75px (13vw) 269 wide; link grid 2 cols at y335; bottom row stacked (flex-col gap-4) "Open to work" and "Back to top" on separate lines.
