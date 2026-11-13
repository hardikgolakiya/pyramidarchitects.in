# `#marquee-transition`: marquee, image-window growth, ink dissolve, interactive 3D villa (chunk `265...` id 1776)

The hero's "Explore" link and the nav item "Residence" both target this id. It is a long scroll-driven section that goes through four visual phases inside ONE pinned 100vh stage:

1. A cream screen with a huge endlessly scrolling brand marquee and a small centred picture card ("Scroll to enter").
2. The card grows to full screen (scrubbed).
3. The picture dissolves like ink through a noise shader, revealing a blue 3D viewer (the villa model).
4. Six scroll-driven "views" of the model (camera flies, parts of the model fade to wireframe), with a HUD (title, counter, progress bar, side rail).

## Geometry and constants
```ts
const WORDS = Array.from({length: 8}, () => BRAND)            // 8 repeats per copy, 3 copies in the track
const VIEWS = ['full', 0, 1, 2, 3, 4, 5]                       // 7 views: full + 6 model groups
const TOTAL = 220 + 100 * VIEWS.length                          // 920  (vh of pinned scroll)
const P_GROW  = 100 / TOTAL                                    // 0.1087  card growth ends (scroll 100vh)
const P_INK   = 220 / TOTAL                                    // 0.2391  dissolve ends / views begin (scroll 220vh)
// section.style.height = (TOTAL + 100) + 'vh'  ->  1020vh   (9180 px at 900 vh)
```
`section#marquee-transition.relative.bg-[#EDE6D6].text-[#2A2725]` style height `1020vh`; child `.marquee-stage.relative.h-screen.w-full.overflow-hidden` is the pinned element.

## Master ScrollTrigger (scrub timeline, GSAP `matchMedia` only for the phone-landscape override)
```ts
const tl = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom',
                   pin: stage, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true },
  onUpdate() {
    const p = tl.progress()
    inkProgress.current  = 1.5 * clamp(0, 1, (p - P_GROW) / (P_INK - P_GROW))    // 0 -> 1.5, drives shader uProgress
    viewProgress.current = clamp(0, 1, (p - P_INK) / (1 - P_INK))                 // drives HUD bar
    setHudVisible(p >= P_GROW)                  // HUD layer fades in (opacity transition 700 ms)
    setAnimationActive(p >= P_GROW && p < 1)    // R3F frameloop 'always' only while active, else 'demand'
    setView(p < P_INK ? 'full' : VIEWS[Math.min(6, Math.floor((p - P_INK) / (1 - P_INK) * 7))])
  }
})
tl.to({}, { duration: 1 }, 0)                                                      // defines the progress clock
  .to(canvasCard, { width: '100vw', height: '100vh', borderRadius: 0, ease: 'power2.inOut', duration: P_GROW }, 0)
  .to(prompt,     { opacity: 0, duration: 30 / TOTAL }, 0)                          // done by scroll 30vh
  .to(track,      { opacity: 0, yPercent: -25, duration: 60 / TOTAL }, 20 / TOTAL)  // scroll 20vh to 80vh
```
Scroll mapping (desktop 900 px viewport, pin starts at scroll 4680, 1 vh = 9 px, total pin 8280 px):

| Progress | Scroll into pin | What happens |
|---|---|---|
| 0.0000 | 0 | card 24rem x 38vh centred, marquee running, prompt visible |
| 0 to .0326 | 0 to 270 | prompt fades out (30vh) |
| .0217 to .0870 | 180 to 720 | marquee track fades and lifts 25% of its height |
| 0 to .1087 | 0 to 900 | card grows to 100vw x 100vh, radius to 0 (`power2.inOut`) |
| .1087 | 900 | HUD layer visible (opacity 0 to 1 in 700 ms), R3F frameloop switches to `always` |
| .1087 to .2391 | 900 to 1980 | ink dissolve (`uProgress` 0 to 1.5) uncovering the 3D scene |
| .2391 to .3478 | 1980 to 2880 | view "full" holds in the viewer (it is also the view during 0 to 220vh) |
| then every 100vh (.1087) | 2880 onwards | view changes: Walls 320-420vh, Floor 420-520, Roof 520-620, Pillars 620-720, Stairs 720-820, Windows and Doors 820-920 |
| 1.0 | 8280 | pin releases, `#residence-slides` follows (section bottom reached at 13860) |

Verified live at pin start: card rect `528,279,384,342` (24rem = 384 px wide, 38vh = 342 px tall, centred), radius `4px` (`rounded-sm`), track opacity 1, prompt opacity 1; after scroll the card was `0,0,1440,900` radius 0, track opacity 0 with `translateY(-27px)` (= 25% of the 108 px line height), prompt 0.

## Marquee track
`div.pointer-events-none.absolute.inset-0.z-10.flex.items-center.overflow-hidden` > `.marquee-track.flex.whitespace-nowrap.font-sans.font-medium.leading-none.tracking-[-0.07em]` text `clamp(2.5rem,10vw,8rem)`, `lg:clamp(3.5rem,7.5vw,8rem)`. Contains 3 identical `div.flex.shrink-0` groups, each 8 `<span class="mx-[0.2em]">BRAND</span>`.
```ts
gsap.to(track, { xPercent: -33.333, duration: 20, ease: 'none', repeat: -1 })     // seamless loop, 20 s per third, independent of scroll
```
It starts a few hundred px off at pin start in the live site because the loop has been running since mount (measured `translateX(-3302px)` at first sample, a free-running value).
Text colour is inherited `#2A2725` on cream `#EDE6D6`. Prompt: `.marquee-prompt.absolute.bottom-8.left-1/2.z-30.-translate-x-1/2.text-[10px].uppercase.tracking-[0.2em].text-black/55`, copy "Scroll to enter".

## The card (`.marquee-canvas`) and the ink-dissolve shader
Container: `pointer-events-none absolute left-1/2 top-1/2 z-40 h-[28vh] w-[min(70vw,18rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm lg:h-[38vh] lg:w-[min(72vw,24rem)]`. Phone landscape (`(orientation:landscape) and (max-height:500px) and (max-width:1023px)`): `gsap.set(card,{width:'72vh',height:'45vh'})`.

Inside, a three.js `WebGLRenderer({alpha:true, antialias:false, powerPreference:'default'})`, `setPixelRatio(min(dpr,1.25))`, canvas sized to the full viewport (`100vw x 100vh`) and centred in the card with `translate(-50%,-50%)`, so the picture is fixed to the viewport and the growing card is simply a window revealing more of it (no scaling of the image). Scene: `OrthographicCamera(-1,1,1,-1,0,1)`, `PlaneGeometry(2,2)`, `ShaderMaterial transparent`, texture = hero image (`hero5.webp`, linear filters, clamp wrap). `requestAnimationFrame` loop: `uTime = ms * .001`, `uProgress = inkProgress.current`. On resize: `setSize(innerWidth, innerHeight, false)`, `uResolution = canvas.width/height`. If WebGL fails: error logged and the card stays an empty window.

Fragment shader (exact logic):
```glsl
precision highp float;
uniform sampler2D uTexture; uniform vec2 uResolution, uTexSize; uniform float uTime, uProgress;
float random(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
  float a=random(i), b=random(i+vec2(1,0)), c=random(i+vec2(0,1)), d=random(i+vec2(1,1));
  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y; }
float fbm(vec2 p){ float v=0.0, amp=0.5; for(int i=0;i<5;i++){ v+=amp*noise(p); p*=2.0; amp*=0.5; } return v; }
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 texSize = max(uTexSize, vec2(1.0));
  float scale = max(uResolution.x/texSize.x, uResolution.y/texSize.y);          // object-fit: cover
  vec2 scaledTex = texSize*scale, offset = (scaledTex-uResolution)*0.5;
  vec2 texUV = (frag+offset)/scaledTex;
  vec2 uv = frag/uResolution.xy;
  vec2 noiseUV = uv * vec2(uResolution.x/uResolution.y, 1.0);
  float ink = fbm(noiseUV*2.0 + uTime*0.16);
  float threshold = smoothstep(0.0, 1.0, ink - (1.0 - uProgress*1.2));
  float alpha = 1.0 - threshold;
  vec4 color = texture2D(uTexture, texUV);
  gl_FragColor = vec4(color.rgb, color.a*alpha);
}
```
Effect: at `uProgress 0` alpha is 1 everywhere (threshold arg is always negative); as it rises to 1.5 (reached exactly at scroll 220vh) blobs of the noise field punch through and the image is gone, uncovering the viewer behind (z-30). The vertex shader is three's default for a 2x2 plane (clip-space quad).

## 3D viewer layer (HUD container `absolute inset-0 z-[30] overflow-hidden bg-blue-900`)
Opacity class `transition-opacity duration-700` (visible: `opacity-100`, hidden: `pointer-events-none opacity-0`), `aria-hidden` while hidden. Contents: R3F canvas, right rail, "drag to rotate" hint, bottom HUD.

R3F `<Canvas camera={{position:[8,6,8], fov:50}} dpr={[1,1.5]} frameloop={visible&&active?'always':'demand'} gl={{powerPreference:'high-performance'}}>`; FOV becomes 75 when canvas width < 768. Pointer events on canvas only when `(min-width:768px) and not ((orientation:landscape) and (max-height:500px))` (so phones scroll instead of orbiting).
- Light: `directionalLight position [5,10,5] intensity 1.2 castShadow`; `<Environment files=[px,nx,py,ny,pz,nz] background>` from a cube-map folder (placeholder: client supplies sky textures); model `/assets/models/vill_draco.glb` (Draco, preload at boot) in a group `rotation [-PI,0,0] scale .022`; camera-controls (`CameraControls`): left mouse ROTATE, middle/right/wheel NONE, `smoothTime .25 s`, `draggingSmoothTime .125 s` (library defaults), `enabled = hud visible`.
- Camera fly per view: `controls.setLookAt(posX,posY,posZ, tx,ty,tz, true)` (animated by camera-controls damping) where position = offset + model bounding-box centre; targets = centre + targetOffset:

| View | Camera offset | Target offset |
|---|---|---|
| full | [2.3, 2.3, 16.9] | [1.2, 0, -5.4] |
| group 0 Walls | [-5.3, 15.4, 16.2] | [1.4, -0.2, -1.6] |
| 1 Floor | [18, 7.6, 9.4] | [5.8, -3, -3] |
| 2 Roof | [4.2, 14.5, 14.5] | [4.3, 3.4, 3.4] |
| 3 Pillars | [-1, 16.2, 11.9] | [5.8, -12.6, -10.4] |
| 4 Stairs | [11.1, 4.2, -15.6] | [-1.6, -8.9, 7.3] |
| 5 Windows & Doors | [-11.3, 3.3, -19] | [-0.099, -5.3, -6.7] |
These offsets are tied to the reference GLB; they must be re-authored for the client model.
- Part highlighting (`useFrame`): every mesh has two renderings. Solid mesh opacity lerps `o += (target-o)*4*dt` with target 1 if the mesh belongs to the active group (or view is `full`) else `.025`; `transparent = o < .99`, `depthWrite = o >= .99`. In non-full views each mesh also gets an edge outline (`EdgesGeometry(geom, 20deg)`, `lineBasicMaterial color #354F79 toneMapped:false transparent`) whose opacity lerps to 1 (active) or `.09` (others) with the same `4*dt` factor. Group membership lists: Walls [walls, outerwalls], Floor [floor], Roof [toproof, outerroof], Pillars [pillers], Stairs [stairs, stairfull, stairmainframe, stairsframe], Windows & Doors [windowframe, doorandwindowframe, windowandroofglass].
- Mesh materials forced `side: DoubleSide`.

### HUD
- Bottom bar: `absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-6 pb-6 pt-20 lg:px-10 lg:pb-8 lg:pt-28 text-white pointer-events-none`. Left block (`role=status aria-live=polite`): eyebrow ("Structure" with 24 px rule), view title (`text-3xl md:text-4xl lg:text-6xl leading-none tracking-[-0.04em]`), stat line (`text-xs md:text-sm uppercase tracking-[0.14em] text-white/75`). Right: two-digit counter (`text-4xl md:text-5xl lg:text-8xl tabular-nums`) and "of 07". Below: progress track `mt-6 h-[2px] bg-white/25`, fill `scaleX(viewProgress)` origin-left, 6 tick marks at `(k+1)/7*100%`, thumb dot 10 px with glow `left: viewProgress*100%`.
- Right rail (desktop `lg:right-10 lg:top-1/2`, mobile `right-4 top-[38%] scale-90`; hidden below md): vertical 1 px line `bg-white/20`, fill line `scaleY(clamp((viewProgress*7 - .5)/6))` origin-top with glow `0 0 8px rgba(255,255,255,.45)`, 7 buttons (20 px hit area): active dot 14 px white + `ring-4 ring-white/20`, completed dot 8 px white/80, upcoming 8 px outlined white/40; `transition-all duration-300`. Click calls `setView(index)` (jumps the camera/model directly; the next scroll `onUpdate` overwrites it with the scroll-derived view, so the rail is a preview, not a scroll seek).
- The progress values are written straight to element styles each tick: `gsap.ticker.add(update)` while `animationActive`, removed otherwise.
- Text swap on each view change: `gsap.fromTo('[data-hud-text]', {yPercent:60, opacity:0}, {yPercent:0, opacity:1, duration:.6, ease:'power3.out', stagger:.06})` (title, stat, counter).

### One-time hints (play once per session, only when HUD visible)
- On entering view index 1 (Walls): `.rotate-hint` (bottom-24, centred, `hidden lg:flex`): delay .5; `fromTo {opacity:0,y:10} -> {opacity:1,y:0} .5 power3.out`; icon `rotation:360` 1.4 s `power1.inOut` repeat 2; fade out at 4.2 (`opacity 0, y 10, .5 power2.in`). Label "Drag to rotate", icon in `h-12 w-12 rounded-full border border-white/50 bg-white/10 backdrop-blur-sm`.
- On entering view index 2 (Floor): `.rail-hint` (white 36 px circle with click-hand icon at the rail's left): `fromTo {opacity:0,scale:.6} -> {opacity:1,scale:1} .4 back.out(2)`; icon `x:6` .35 s `power1.inOut` repeat 5 yoyo; `.rail-hint-ring` `scale 1 -> 2, opacity .6 -> 0`, .7 s `power1.out` repeat 2; hide at 2.1 (`opacity 0, scale .6, .4 power2.in`).
Flags reset when HUD hides (leaving upward).

## Reduced motion
Not guarded here: the marquee loop, scrubbed pin, shader time and camera fly all still run (Lenis smooth wheel is disabled globally).

## Minimal rebuild skeleton
```ts
const TOTAL = 220 + 100 * 7, P_GROW = 100 / TOTAL, P_INK = 220 / TOTAL
gsap.to(track, { xPercent: -33.333, duration: 20, ease: 'none', repeat: -1 })
const tl = gsap.timeline({ defaults:{ease:'none'},
  scrollTrigger:{ trigger: section, start:'top top', end:'bottom bottom', pin: stage, scrub:.8, anticipatePin:1, invalidateOnRefresh:true },
  onUpdate: () => update(tl.progress()) })
tl.to({}, {duration:1}, 0)
  .to(card,   { width:'100vw', height:'100vh', borderRadius:0, ease:'power2.inOut', duration:P_GROW }, 0)
  .to(prompt, { opacity:0, duration:30/TOTAL }, 0)
  .to(track,  { opacity:0, yPercent:-25, duration:60/TOTAL }, 20/TOTAL)
```
