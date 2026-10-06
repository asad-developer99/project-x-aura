# Aura Sound · DESIGN.md (Day 09)

**Brand:** Aura Sound, a fictional maker of premium wireless over-ear headphones. One flagship, **Aura One**, in three colourways. Prices in ₹ (concept site, sample prices).
**Hook:** *"Spin a product with your scroll wheel."*
**Audience:** people who buy one good pair and keep it for years: commuters, creators, people who work in loud places.
**Mood:** tech minimal, dark, precise and quiet. Every screen is a black stage with one product lit by a thin rim light and almost nothing else. Motion is exact and calm, never bouncy; the only loud moment is the room going quiet.

8 of 8 choices are different from the last three sites (comparison in the local sites log). The brief's 360° spin is the one deliberate echo of an earlier site; see "Hero" below.

---

## 1. Choices

| Menu | Pick | Why, for this site |
|---|---|---|
| Look | **L18 Clinical noir**: near-monochrome ash and steel, the accent only on things you can touch, chapters fade through black | Headphones are about removing noise. A page with almost no colour *is* the product promise. |
| Palette | **Graphite halo** (custom): bg `#0F1011` · surface `#18191B` · text `#EDECE8` · muted `#9C9DA3` · line `#26272A` · accent **lilac halo `#C9B8FF`** (text on accent `#0F1011`) | The "aura" is a pale lilac glow, used only for the rim light's edge, buttons, the nav ring and live numbers. It passes the category-reflex check: audio usually gets black + neon blue/green; lilac is neither. |
| Type pair | **T25 Syncopate** (headings, wide caps) + **Space Mono** (body, labels, prices) | Wide, spaced capitals feel like a hardware spec plate. Mono body suits the spec-sheet cards. Body copy stays short (≤ 2 lines) because mono is slower to read. |
| Nav | **N10 Corner logo + progress ring** (layout **NV07** corner circle menu) | The top-right ring is a **volume knob**: it fills lilac as you scroll and opens the menu. A small "Bag 0" pill sits beside it, so the shop never disappears. |
| Hero | **Scroll-wheel turntable** (layout **HR12**, restyled): the headphones float on a black stage under a thin rim light and turn 0° → 360° as you scroll. A live degree dial runs round them like a turntable ring, and four callouts lock on at 0°, 90°, 180° and 270°. | It is the hook itself: your scroll wheel spins the product. The rim light stays fixed while the product turns, so the highlight sweeps across the shapes. |
| Section shape | **S9 Letterbox bars**: thin black bars close in and open between chapters, like a film cut | Matches the clinical-noir chapters and gives the reel clean cuts. |
| Cards | **C10 Spec sheet**: cut-out product above a mono label grid (name · colour · weight · price), hairline rules | It reads like an engineering drawing. It suits a buyer who reads specs. |
| Signature | **The room goes quiet** (noise cancelling): a crowded night train, with noise words floating all over it. As you scroll, noise cancelling switches on: the words are blown away into the distance, the wave line flattens to one hairline, the crowd blurs and slows, and only the listener stays sharp. "Quiet." | It shows the main reason to buy (noise cancelling) as a feeling, not a spec. |
| Loader | **I33 Dot ring wave**: hundreds of dots on a slowly turning ring with a sound-like bulge running round it. At 100% the dots drift out, and the ring becomes the hero's degree dial. | The ring is an ear cup and a sound wave in one. It hands straight over to the hero, which is already turning (no wait after the loader). |
| Travelling object | **F1 Waypoint travel** (PNG cut-outs), with **MotionPath** arcs between waypoints | One pair of headphones carries the story down the page: off the spin, onto the listener's head, onto the battery, into the colours, into the footer. F1 is the right carrier: the cut-outs we already have are enough (no 3D, +0 KB), its anchors are laid out by CSS (so phones get their own shorter path), and Flip-style measuring lets it land exactly in each section's box. |

**Easing:** arrivals `expo.out`-like `cubic-bezier(0.22,1,0.36,1)`, 0.6–0.9 s; scrubs linear; chapter cuts `cubic-bezier(0.77,0,0.175,1)`. No bounce, no elastic.
**Light rule:** every product shot has the same light: a thin cool-white rim from the upper right with a faint lilac edge, a black stage and a soft floor reflection. All assets share this grade.

---

## 2. Section plan (9 parts: loader + 7 sections + footer, nav on top)

Cut from 12 to 9 for a ~33 s reel, so each section gets more screen time. Dropped: "Compare editions" (a table can't be read in a reel) and "Offer" (its line moves into the colour card).

| # | Section | Layout (SECTION-MENU) | Starts from | Restyled how |
|---|---|---|---|---|
| — | Loader | — (I33) | `/lab/motion` I33 dot ring | Dots in ash grey, the bulge lit lilac. The ring's size and position match the hero dial exactly, so it becomes the dial. |
| — | Nav | **NV07** corner circle menu | `components/sections/nv-*.tsx` NV07 | Wordmark top left, in Syncopate. Top right: the volume-ring button (scroll progress) + a "Bag 0" pill. The menu opens as a black circle from the ring, with 4 big mono links. |
| 1 | **Hero: Spin it.** | **HR12** atmospheric light-ray hero | HR12 | The light rays become one thin rim-light beam from the upper right. Centre: the spin frames. Round them: the degree dial (000° → 360°, ticks every 10°). Callouts at the four angles: **0°** "Knit memory-foam cushions" · **90°** "Twin-rail aluminium band" · **180°** "Fold-flat titanium hinge" · **270°** "8 mics, 2 per cup, listening out". Bottom left: "AURA ONE · ₹29,990 · [Pre-order]". Headline "SPIN IT." left, small. |
| 2 | **Signature: The room goes quiet** | **FT10** opposite marquees around a statement | FT10 | Two rows of noise words (HORN · CHATTER · BRAKES · RAIN · ANNOUNCEMENT · KEYS · BABY · ENGINE) drift in opposite directions over the train video. A sine-wave line crosses the screen. Centre statement: "THE ROOM GOES QUIET." Below, a −42 dB readout. No other marquee anywhere on the page. |
| 3 | **Inside the cup** (exploded view) | **FT04** product with callout lines | FT04 | The explode video scrubs. The cup is seen in **three-quarter view**: the layers fly out **to the left along the cup's own axis**, while the shell + band stay on the right. Hairline callouts draw out to the five layers: cushion · acoustic mesh · 40 mm carbon-dome driver · magnesium frame + mics · shell with titanium ring. Glass step cards are replaced by **hairline spec labels** (C10 style). Because the layers fill the left side, the text is not a left column: a short headline sits top left above the layers, and the five labels sit in one row under the layers, each with a hairline up to its part. |
| 4 | **Sound** | **FT17** wide masked visual + four footnotes | FT17 | The wide visual is the word **HEAR EVERYTHING** set huge in Syncopate, with drifting ash and lilac sine lines inside the letters. Four mono footnotes underneath: 40 mm carbon-dome driver · 4 Hz–40 kHz · LDAC + Hi-Res Wireless · Spatial audio with head tracking. |
| 5 | **40 hours** (battery) | **BN11** ruled grid with a full-width stat band | BN11 | The full-width band is a **battery cell**: a long tube that fills with a lilac liquid line as you scroll, its surface sloshing with the scroll speed, and "40 H" counting up at its tip. The ruled grid below: "5 min charge = 4 h" · "USB-C fast charge" · "Multipoint, 2 devices" · "268 g". |
| 6 | **Choose your colour** | **PS11** wheel label picker + crossfade image | PS11 | A curved wheel of three names: GRAPHITE · MOONSTONE · DUNE. The cut-out at the marker crossfades, and a soft tint behind the product shifts to that colourway (graphite → cool silver → warm sand). C10 spec card: colour, finish, ₹29,990, "Free hard case · no-cost EMI from ₹2,499/mo", [Add to bag]. **Nothing changes by itself:** in record mode the wheel turns with the scroll; in normal mode it only changes when the visitor clicks a name (or the ‹ › arrows). |
| 7 | **Reviews** | **SP05** rating summary | SP05 | Big "4.8" and "12,406 ratings" roll in. A 5→1 star bar list, then three short mono quotes with fake first names + city ("Ira, Pune · daily metro"). |
| 8 | **Footer** | **FO12** circular text-ribbon footer | FO12 | The travelling headphones land and rest in the centre (in the last colour shown on the wheel); the ribbon "AURA SOUND · HEAR LESS · HEAR MORE ·" turns round it like a record. Mono link columns either side + a small [Pre-order] button. Note: "Concept website by <studio> · sample prices". |

**Travelling headphones (F1, across the page).** One headphone cut-out travels down the page with the scroll and lands in each section. Waypoints: **Hero** (it detaches from the last spin frame, key-front) → **Quiet** (shrinks onto the listener's head and fades into the video) → *hidden through Inside the cup and Sound* → **40 hours** (a small icon riding the tip of the battery liquid) → **Colour** (lands on the wheel marker and becomes the colourways) → **Footer** (rests in the centre of the text ring). Images: `key-front.png` + `key-back.png` (cut out from images 1 and 2) and the three colourway `.png` cut-outs; no new Flow images.

Count: hero + 3 cinematic (Quiet, Inside, Sound) + 3 shop-style (Battery, Colour, Reviews) + footer.
Layout check: 9 codes (NV07 · HR12 · FT10 · FT04 · FT17 · BN11 · PS11 · SP05 · FO12), none repeated on the site, and none used by the last 3 sites (checked in the sites log).

---

## 3. Motion map

| # | Section | Layout | Motion | How it plays here | Record mode |
|---|---|---|---|---|---|
| 0 | Loader | — | **I33** dot ring wave | Ash dots on a turning ring, with a lilac bulge wave running round as the % climbs (the real load: hero frames). At 100% the dots drift outward and the ring stays as the hero dial; the hero is already turning (intro 0° → 12° plays by itself). | Runs from the first paint (CSS turn so it is never still), 2.5 s |
| 1 | Nav | NV07 | **M26** progress fill | The corner ring fills lilac with page progress (the volume knob); the bag count bumps when F8 lands (detail). The menu opens as a circle from the ring. | Ring fills through the whole reel |
| — | Travelling headphones (across the page) | — | **F1** waypoint travel (PNG), MotionPath arcs | One fixed layer above the stages and **under all text**. Every section that it visits holds an invisible `data-anchor` box (laid out by CSS); the driver measures them and one scrubbed timeline (time = scroll) carries the object between them on soft MotionPath arcs, easing `sine.inOut`/`power2.inOut` per leg, no overshoot, no bounce. Angles: `key-front.png` ↔ `key-back.png` crossfade by `turn`; on the colour marker it crossfades into `graphite.png` → `moonstone.png` → `dune.png` with the wheel. **Legs:** (1) **Hero → Quiet:** at 360° the spin canvas hands over to `key-front.png` on the exact same box (measured from the last frame, so there's no jump), then it lifts off, turns a half turn to `key-back.png` and shrinks onto the listener's head (box measured on the room video), where it fades into the video over ~0.4 s as noise cancelling begins. (2) **Hidden** through Inside the cup and Sound (opacity 0, no layer drawn). (3) **40 hours:** it fades in small (~56 px) at the empty end of the battery tube and rides the liquid's tip as it fills (the anchor follows the tip every frame); the "40 H" count sits above the tip, never under the icon. (4) **Colour:** it rises from the tube tip, grows and lands on the wheel marker, where it *is* the picker's product image (graphite), then changes colour with the wheel. (5) **Footer:** it leaves the marker in the last colour shown and comes down into the centre of the text ring, where it rests with a slow float. **Never blocks text:** each anchor sits on the side opposite its text, text sits above the object layer, and on the legs between sections it crosses only empty stage. A soft shadow + lilac rim glow follows it. | Travels with the scroll and **never pauses**: on each waypoint it keeps drifting slowly along its anchor (a slow ~2° turn + scale breathing) plus the idle float, so it is always moving; no clock-based holds. Hidden legs are skipped |
| 2 | Hero | HR12 | **M179** 360° product spin + degree dial (driven by scroll, not drag) | Pinned ~300vh. Scroll = angle: frames by video time (2 × 180° clips, or the 3D turntable if they don't match). The dial's ticks and the 000° readout turn with it; each callout draws its leader line and types in as its angle passes, then dims. The rim light stays still, so the highlight sweeps. Idle: a slow ±1.5° sway + rim shimmer, so it never freezes. The spin ends exactly on key-front, where the travelling headphones take over (F1). | Scrub, 6 s for the full turn (1.5 s per callout) |
| 3 | The room goes quiet (signature) | FT10 | **M351** pinned words fly back and up | Pinned ~280vh. First 50%: the train video plays at normal speed (the crowd sways, the listener in the centre stays still), the noise words drift in their two rows and the sine line shakes. Then noise cancelling switches on: each word tumbles back into depth and fades (outer words first), the line flattens to one hairline, the video slows to ¼ speed, desaturates and blurs except the listener, and "−42 dB" counts down. It ends on "QUIET." with slow grain. | Scrub, 5.5 s; the slowed video + grain keep it alive at the end |
| 4 | Inside the cup | FT04 | **M443** frame scrub with step cards | Pinned ~240vh. The explode video scrubs by video time (layers travel left along the cup's axis, shell + band stay right); at each measured layer second, its hairline label draws in (DrawSVG) and the previous one dims. | Scrub, 4.5 s (~0.9 s per layer label) |
| 5 | Sound | FT17 | **M263** coloured lines clipped to text | Sine lines drift sideways inside HEAR EVERYTHING; their amplitude follows the scroll speed. The four footnotes slide in line by line as support. | Lines always drifting, 3 s |
| 6 | 40 hours | BN11 | **M455** liquid-edge progress bar | The battery tube fills with the scroll; its wave surface tilts with the scroll speed and settles. "40 H" counts at the tip (continuous count, no steps). Grid cells unfold as support. | Scrub + slosh + idle wave, 3 s |
| 7 | Choose your colour | PS11 | **M545** wheel picker with background crossfade (scroll-driven in record mode, click in normal mode) | The product at the marker is the travelling headphones (F1), which land there from the battery. **Normal mode:** not pinned; the wheel only moves when the visitor clicks a name or an arrow (0.7 s turn, the cut-out + tint crossfade at the marker, the card's colour line swaps). Nothing changes by itself; only a slow rim-light shimmer on the product. **Record mode:** the section pins for its 4 s and the scroll turns the wheel continuously and linearly Graphite → Moonstone → Dune (the crossfade follows the wheel's position, no steps), finishing exactly at the end of the pin. | Scroll-driven wheel, 4 s (~1.3 s per colour) |
| 8 | Reviews | SP05 | **M48** odometer roll, full spin | "4.8" and "12,406" spin full digit cycles into place; the star bars fill as support. | Plays on enter, 2.5 s |
| 9 | Footer | FO12 | **M33** orbit / carousel ring | The text ribbon turns round the travelling headphones, which come to rest in its centre (one ribbon turn per 18 s) and speeds up with the scroll; the cup counter-turns a little. A broad lilac light band sweeps slowly behind it (coarse motion for the end screen). | Always turning (the end screen never freezes), 2 s |

Codes used once each: I33 · M26 · M179 · M351 · M443 · M263 · M455 · M545 · M48 · M33, plus the travelling-object codes **F1** (carrier) and **F8** (detail). No section is a plain fade.

**Transitions**
- Loader → Hero: I33 hand-over (the ring becomes the dial, the dots drift out over the stage).
- Hero → Quiet: **X12 fade through black**; the noise words appear out of the black before the train does.
- Quiet → Inside: **X5 hard cut on beat**: the cut lands right on "QUIET." (silence, then the part).
- Inside → Sound: **S9 letterbox bars** close to a slit and open on the word.
- Sound → 40 hours: **X22 feathered gradient mask wipe**.
- 40 hours → Colour: **X2 colour wash** from graphite into the first colourway's tint.
- Colour → Reviews: **X1 overlap slide** (the reviews slide up over the picker).
- Reviews → Footer: **X40 footer revealed under the page**.

**Details (Round 4, each one also plays by itself on camera):** the Add-to-bag cut-out flies into the Bag pill (**F8**) when the visitor clicks Add to bag (in record mode once, at the end of the colour pin, on Dune); magnetic Pre-order button; cursor label "Spin" on the hero, "Pick" on the colour names (click only, no drag); link underlines draw in lilac; the bag count bumps; the ring button shows a tiny "%".

---

## 4. Record timing (~33 s, `?record=1`) — superseded by §7

Loader 2.5 s · Hero 6 s · Quiet 5.5 s · Inside 4.5 s · Sound 3 s · 40 hours 3 s · Colour 4 s (3 colours) · Reviews 2.5 s · Footer 2 s ≈ **33 s**. The travelling headphones add no time: each leg flies during the hand-over between two sections (the last ~15% of one section's scroll and the first ~15% of the next), so the total stays about 33 s. Set with `data-record-time` stops in Round 1; trimmed in Round 5.

---

## 5. Assets still needed (Round 0: none made yet)

**Few, strong assets: 8 images + 4 videos.** One product design in every asset, always generated from image **1** as the reference.

**The product (paste into every prompt):**
> *Aura One wireless over-ear headphones: a slim headband that splits into two thin parallel aluminium rails above each ear cup; oval ear cups with a flat matte graphite face and a thin brushed-titanium ring round the edge; soft dark-grey knit-covered memory-foam cushions; slim fold-flat hinges; no visible logos, no text, no buttons on the face.*

(It must not look like any real headphone: no mesh canopy, no rectangular cups, no visible brand marks.)

**Shared look (end every prompt with):** *dark studio, near-black seamless background (#0F1011), one thin cool-white rim light from the upper right with a faint lilac edge, a soft reflection on a black glossy floor, photorealistic, sharp, minimal, no text, no logos.*

Check the ratio chip in Flow before every generation (it keeps the last one).

### Images (Nano Banana Pro in Flow)

| # | File | Ratio · type | Prompt (add the product + shared look) |
|---|---|---|---|
| 1 | `raw/key-front.jpg` ✅ received | **16:9** (1920×1080) · .jpg | *"Aura One headphones floating upright in the centre of the frame, seen from the front three-quarter view (turned 30° to the left), headband on top, both ear cups visible, the product fills about 45% of the frame height, lots of empty black around it."* **Master image: all other assets use it as the reference.** |
| 2 | `raw/key-back.jpg` ✅ received | **16:9** · .jpg | Reference = 1. *"Keep the product exactly as in the reference. The same headphones turned 180°: seen from the back three-quarter view, same height, same size in frame, same centre, same light from the same side."* |
| 3 | `raw/explode-start.jpg` ✅ received (as made: **three-quarter view**, not side-on; the cup + band on the right) | **16:9** · .jpg | Reference = 1. *"One ear cup of the reference headphones, seen exactly side-on (profile), assembled, filling the right half of the frame, its cushion facing left, the headband cut out of frame; calm empty black on the left third."* |
| 4 | `raw/explode-end.jpg` ✅ received (as made: three-quarter view, the layers spread **to the left along the cup's axis**; the shell + band stay on the right) | **16:9** · .jpg | Reference = 3. *"Exactly the same ear cup, same angle and position, now an exploded technical view: five layers floating apart in a straight horizontal line, evenly spaced, from left to right: knit memory-foam cushion, thin black acoustic mesh disc, 40 mm carbon-dome driver, magnesium frame with small microphone holes, outer graphite shell with the titanium ring. Same light, each layer catches the rim light."* |
| 5 | `raw/room-start.jpg` ✅ received | **16:9** · .jpg | Reference = 1 (for the headphones only). *"A crowded metro train carriage at night, wide medium shot, the camera at chest height. In the centre, one young adult listener seen from behind at a three-quarter angle, from the chest up, the head turned slightly away so the face is not visible, wearing the reference headphones in graphite; arms relaxed and hanging down, the hands below the bottom edge of the frame. Standing passengers all around, soft and slightly out of focus, faces turned away or too small and blurred to read. Cold fluorescent light mixed with orange tunnel lights through the windows. Cinematic, cool steel-grey grade with warm tunnel flashes, film grain. Fictional people, not resembling any real person. The listener stays in the centre, away from the bottom-right corner; no close-up of any face."* |
| 6 | `raw/colours/graphite.jpg` ✅ received → **`graphite.png`** cut-out | **1:1** (2048×2048) · .jpg from Flow | Reference = 1. *"The reference headphones in Graphite (matte dark grey, titanium rings), front three-quarter view, centred with margin all round, plain mid-grey (#808080) seamless background, soft even studio light, no shadow on the background, no text."* |
| 7 | `raw/colours/moonstone.jpg` ✅ received → **`moonstone.png`** cut-out | **1:1** · .jpg from Flow | Same as 6, *"in Moonstone: pale cool silver-white shell, light grey cushions, brushed steel rings"*, same angle exactly. |
| 8 | `raw/colours/dune.jpg` ✅ received → **`dune.png`** cut-out | **1:1** · .jpg from Flow | Same as 6, *"in Dune: warm sand-beige shell, taupe cushions, champagne-gold rings"*, same angle exactly. |

**Cut-outs done (5 Oct):** `public/images/aura/colours/{graphite,moonstone,dune}.png` (2048², all three line up to the pixel, same box) and `public/images/aura/travel/{key-front,key-back}.png` (2752×1536, the same frame as the hero video). Clean on dark and light, gaps between the band rails see-through, no floor reflection left. The soft lilac halo outside the edges is removed by the cut-out (the rails keep their lilac tint); the traveller's glow is added in code (`ShadowGlow`).

**Travelling headphones (no new Flow images):** cut out images 1 and 2 too: `npm run cutout -- raw/key-front.jpg public/images/aura/travel/key-front.png` and the same for `key-back.jpg` → **`key-front.png`** + **`key-back.png`** (transparent, checked on dark and light; the thin lilac rim must survive the cut-out).

Images 6–8 are generated as .jpg on mid-grey (Moonstone is light), then `npm run cutout -- raw/colours public/images/aura/colours` (rembg + BiRefNet) saves them as **transparent .png**: `graphite.png` · `moonstone.png` · `dune.png`, checked on dark and light. The same cut-outs are used for the colour wheel, the travelling headphones (from the marker to the footer) and the bag fly-in.

### Videos (Veo in Flow, **Frames to video**, 8 s, 16:9 1080p)

| # | File | Start frame → End frame | Prompt | Timeline (we use the early seconds) |
|---|---|---|---|---|
| V1 | `raw/spin-a.mp4` | **1** key-front → **2** key-back (also attach 1 as the reference) | *"The headphones turn slowly to the right on an invisible turntable around their vertical axis, exactly 180 degrees, at a constant speed. The camera is locked; the rim light stays fixed, so the highlight sweeps across the product. The product keeps exactly the same shape, size and position. One continuous shot, no cuts. no text, no logos"* | ✅ received. Brief: use **0–4.0 s only** (after that it overshoots and turns back); watermark cropped. Measured on a contact sheet: the view that mirrors the start frame (true 180°) arrives at **5.0 s**; at 4.0 s it is about 150°; the overshoot starts after ~5.2 s (the turn slows to a stop at 6.0 s, then swings back). |
| V2 ~~not needed~~ (replaced by the mirrored half, see below) | `raw/spin-b.mp4` | **2** key-back → **1** key-front | *"The headphones keep turning to the right, the same direction, another 180 degrees, slowly on an invisible turntable around their vertical axis, at a constant speed. The camera is locked; the rim light stays fixed, so the highlight sweeps across the product. The product keeps exactly the same shape, size and position. One continuous shot, no cuts. no text, no logos"* (180° → 360°) | Same as V1. V1 + V2 joined = one seamless 360° (the last frame of V2 matches the first frame of V1). |
| V3 | `raw/explode.mp4` | **3** explode-start → **4** explode-end | *"Smooth continuous transformation from the start frame to the end frame: the ear cup's layers slowly separate and float apart sideways into the exploded view, in order from the cushion outward, perfectly aligned on one axis. Camera still. One continuous shot. no text"* | 0–1 s: still, assembled · 1–5 s: the layers separate leftward along the cup's axis (we measure each layer's second on a contact sheet) · 5–8 s: hold (trimmed) |
| V4 | `raw/room.mp4` | **5** room-start only (attach 1 as the reference) | *"Start exactly from the reference image. Locked camera. The listener in the centre stays completely still, eyes closed, arms down, the hands always out of frame; only the crowd moves around them: the passengers sway and shift with the train's motion, tunnel lights flash past the windows from right to left, a few people pass along the aisle with slight motion blur. No faces in close-up. One continuous shot, no cuts. no text"* | 0–8 s: constant busy motion around a still listener (we play it by time, then slow it down in code when noise cancelling switches on) |

**Mirror test (instead of V2), 5 Oct:** the second half was built by mirroring spin-a. Result (`recordings/spin-seams.jpg`): the 0–4.0 s cut jumps at both seams (≈30° of turn missing); a 5.0 s cut matches in shape, size and position, but (1) the lilac rim light jumps from one edge of the cup to the other at each seam, and (2) the mirrored half is close to spin-a played **backwards**, so the spin reads as a swing back, not a continuing turn. **Decision (5 Oct): option B approved, no V2 from Flow.** Built `raw/spin-360.mp4` (24 fps, 236 frames, 9.8 s): spin-a 0–5.0 s (watermark painted out *before* mirroring, so it never moves to the left corner) + its mirrored copy. 180° seam: a 6-frame crossfade (frames 115–120). 360° seam: the last 6 frames blend into spin-a's first frame, so the clip ends exactly on key-front (the travelling headphones take over from there). Check sheet: `recordings/spin-seams-blend.jpg`. The hero films this clip (`video-frames`, by video time).

**Spin order:** try V1 + V2 first. I check them on a contact sheet: the end of V1 must match the start of V2 (and the end of V2 the start of V1) in shape, size and position, and the turn must be even. **If they don't match** (the product changes shape, size or drifts): turn image 1 into a 3D model (TRELLIS.2, MIT), compress it with `npm run glb`, and render a 120-frame turntable in the same light. Same frames, same section; I'll do that part.

**Not needed:** no cover image yet (made at the end of the day from a hero frame), no lifestyle grid, no extra product angles.

---

## 6. Build notes (Round 1, 5 Oct)

**Video plan (measured):**
- Spin: `raw/spin-360.mp4` (spin-a 0–5.0 s + mirror, 6-frame blends) → `public/frames/aura-spin` (237 frames, 4.7 MB; phone 2.2 MB). Scroll = angle; the last 0.3 s of the pin holds key-front while the Traveller lifts off. Intro plays by itself at 10°/s until the scroll overtakes it.
- Explode: `raw/explode.mp4` 1.2–8.0 s → `public/frames/aura-explode` (164 frames, 11.2 MB at q52; phone 4.6 MB). Label seconds (clip time = raw − 1.2): cushion 0.8 · magnesium frame 2.0 · driver 3.5 · mesh 5.3 · shell 6.3. Each hairline follows its part's measured track.
- Room: `raw/room.mp4` → `public/video/aura-room.mp4` (1600 px, 2.3 MB) + `-m` (960 px, 0.7 MB). Start/end differed by ~1.7 normal frame steps, so the web file is a baked 0.5 s loop crossfade (7.5 s, raw 0.5–8.0 s): the busiest moment is now at 1.0–2.0 s; playback starts at 0.6 s. Listener's headphones measured at (0.515, 0.30), height 0.27 of the frame.

**Record timeline (30.5 s after the loader, ≈ 33.6 s with it):** hero 5.8 · quiet 1.2 + 4.8 · inside 4.5 (hard cut, no stop at its top) · sound 3.0 · battery 1.0 + 2.2 · colour 4.0 · reviews 2.0 · footer 2.0. No holds anywhere: the scroll only rests at the very end (footer ring keeps turning, light band sweeps).

**How it differs from the plan:**
- F1 arcs are computed per frame (a quadratic curve re-aimed every frame, because both ends of every leg move: pinned stage, battery tip, sticky footer), not a fixed GSAP MotionPath. Same look, calm `easeInOut`, no overshoot.
- Quiet on phones stays pinned (video as a 64svh band on top) instead of unpinned.
- The room blur is drawn at quarter size and upscaled (full-size canvas blur stalled the recorder for 0.7 s).
- The explode canvas stays out of the render tree until 0.15 screen before the cut (decoding it hidden caused a 0.55 s stall in the reel).
- Letterbox bars stop at a 22% slit with a lilac gate edge (a closed 1.6% slit read as a black freeze).
- Colour wheel is a vertical drum (names on a cylinder), not a flat arc: the arc version swung names over the spec card.

---

## 7. Round 2 changes (5 Oct)

**Desktop only (permanent kit rule):** built for 1440×900 only. All phone code is gone (no phone layouts, no breakpoints, no phone frame sets or phone video); the Motion map has no Phone column.

**Readability at reel size:**
- Hero: "SPIN IT." at 5 vw wide caps on the left; callouts 24 px, one line each (Memory-foam cushions · Twin aluminium rails · Fold-flat hinge · 8 mics, 2 per cup).
- Inside the cup: labels 24 px, short names only (Cushion · Mesh · 40 mm driver · Magnesium frame · Shell).
- 40 hours: the count at the tip is 7.5 vw; four big stats (5 min = 4 h of play · USB-C fast charge · 2 devices at once · 268 g all day light).
- Colour: names 4.4 vw on the drum; the card shows only the name, ₹29,990 and Add to bag.
- Reviews: "4.8" at 15 vw with five stars and 12,406 ratings, ONE big quote.

**Motion changes:** loader ~2 s · letterbox cut ≤ 0.6 s (close 14 vh, open 14 vh, no hold) · 40 hours → Colour handed over in place: the battery stays pinned one more screen and fades out while the colour stage (pulled up over that screen) fades in on the same spot, and the headphones glide from the tip to the marker · Add to bag: the pair flies from full product size on a 0.8 s up-arc into the Bag pill, which lights up while the count bumps (record mode: once, as the wheel reaches Dune).

**Record timeline (31.0 s + ~2 s loader ≈ 33 s):** hero 5.8 · quiet 1.2 + 4.8 · inside 4.5 · sound 3.0 · battery 1.0 + 2.2 · colour 1.4 handover + 2.6 wheel · reviews 2.5 · footer 2.0. The reel is recorded at exactly 1440×900 (the recorder used to cut it to 1440×812).

---

## 8. Round 3 polish (5 Oct)

- **~40 px words:** hero callouts (Foam cushions · Twin rails · Fold-flat · 8 mics, one short line each, lilac dot at the end of each leader line) · explode labels 40 px, the newest part's label lilac and the earlier ones dimmed (Mesh and Magnesium frame labels sit slightly off their parts so they never run together) · colour price 48 px + bigger Add to bag · reviews quote 40 px.
- **"SPIN IT."** at 6.2 vw (≈ 18 vw wide), left of the dial (dial radius 0.6 × product height).
- **Battery → Colour:** the battery fades and lifts away over the first 42% of the handover screen; the colour stage fades in only from 50% on. Between them only the gliding headphones are on screen: no text over text.
- **Room landing:** the flying pair reaches the listener's head exactly when the room stage pins, and the video fades in over the next 8% of the pin (~0.4 s) while the pair dissolves into it: only one pair is ever visible.
- **Round 4 details:** magnetic Pre-order buttons (hero + footer, calm power3 ease, no elastic; on camera one slow lean + the shine sweep plays by itself) · lilac underlines that draw in on the footer links (hover; on camera they draw in one after another as the footer arrives).
