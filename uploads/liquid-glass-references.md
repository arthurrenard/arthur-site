# Reference Sites — Liquid-Glass, Dark-Green, Scroll-Animated Portfolio
*Companion research doc for the website design brief. This is reading material for you — the actionable bits are already distilled into §9 of the brief.*

## TL;DR
- The best "liquid glass" reference is **Apple's own product/newsroom pages** (live), which define the frosted-translucency + scroll-reveal language. Pair it with a green-dominant site (**Heights**) and a smooth scroll-motion portfolio (**Eduard Bodak**) to cover all four target qualities.
- **No single live site nails all four at once** (green + liquid glass + lateral scroll + personal portfolio). Borrow one quality from each reference.
- Your exact sage palette (`#4B5945` / `#66785F` / `#91AC8F` / `#B2C9AD`) is rare in the wild — most live green portfolios use green as a bright accent over near-black. Plan to supply the sage palette yourself.

---

## Group A — Liquid Glass / Glassmorphism (Quality #1)

**1. Apple — Liquid Glass design language & product pages**
- URL: https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/ + Apple's live product pages (iPhone, AirPods).
- **Borrow:** frosted translucency, specular edge highlights, light refraction, soft inner glow, rounded floating panels, and toolbars/nav that shrink and materialize on scroll. Apple describes Liquid Glass as a translucent material "informed by surrounding content" that "dynamically reacts to movement with specular highlights." This is the canonical reference for your aesthetic.
- **Best for:** #1 glass + #3 scroll motion. Apple's scroll work is a 60fps smoothness benchmark.

**2. One Page Love — Glassmorphism gallery (sourcing resource)**
- URL: https://onepagelove.com/style/glassmorphism
- **Borrow:** a live, updated index of frosted-panel pages — pull specific nav bars, cards, overlays. Cross-reference its "Scroll Effects" and "Gradients" categories.
- **Best for:** #1 glass (as a sourcing tool).

> **Green glass note:** "green glassmorphism" searches return mostly stock illustrations and Dribbble/Figma concepts, not live sites. Use those as mood references only.

## Group B — Dark Green theme (Quality #2)

**3. Heights — brand & product studio**
- URL: https://www.heights.agency/
- **Borrow:** green-dominant field with white text. Palette is essentially 2 colors — `#257878` (deep teal-green) + `#FFFFFF`. An Awwwards Site of the Day built with GSAP/Vue/Nuxt with heavy smooth scroll. Study the green gradient depth and white-on-green legibility.
- **Best for:** #2 green + #3 smooth scroll.
- **Caveat:** green leans teal/saturated vs. your muted sage — use for structure/contrast logic, then swap in your hexes.

**4. Jesse Martinez — software engineer portfolio**
- URL: https://jessemartinezdesign.com/
- **Borrow:** near-black base (`#0e0e0e`) with vibrant green accent, interactive 3D hero shapes, scroll-triggered reveals. Closest live *single-developer portfolio* in the "dark + green accent" lane; doubles as a structure reference.
- **Best for:** #2 green (as accent) + #4 personal portfolio.

## Group C — Fluid scroll-driven / lateral motion (Quality #3)

**5. Eduard Bodak — creative developer portfolio**
- URL: https://eduardbodak.com/
- **Borrow:** the smoothness itself. Awwwards SOTD; per Codrops, built in Webflow with GSAP + Locomotive Scroll V5 + Swup.js, with a scroll progress bar and scroll-reactive sections — the "Apple-quality, not scroll-hijacking" feel. Borrow pacing + progress indicator, not colors (it's yellow-on-black).
- **Best for:** #3 motion + #4 single-dev portfolio.
- **Caveat:** it's a motion showcase with few real projects — mine it for animation feel, not case-study structure.

**6. Fleur Moreau — freelance portfolio (horizontal scroll)**
- URL: https://www.fleurmoreau.com/ *(verify it currently resolves)*
- **Borrow:** vertical scrolling that drives smooth **horizontal/lateral section transitions** — the cleanest live example of your signature "scroll down → slide sideways" effect. Awwwards SOTD; built with GSAP + Hammer.JS. Palette is green-adjacent (`#49c5b6` teal + white + soft yellow).
- **Best for:** #3 lateral scroll + partial #2 green-adjacent.

## Group D — Portfolio structure (Quality #4)

**7. Cole — minimal portfolio template (live demo)**
- URL: https://derekcole.framer.website/
- **Borrow:** clean single-creator structure — hero intro, dated project list with "View project" links, About, stats, services. Good skeleton for section order/pacing. Built in Framer.
- **Best for:** #4 structure.

**8. Active Theory — studio portfolio**
- URL: https://activetheory.net/
- **Borrow:** ambitious scroll/WebGL storytelling + project pacing, for depth/immersion ideas. Use sparingly — heavier than a personal site needs.
- **Best for:** #3 motion + #4 portfolio.

---

## How to use these with Claude Design
1. **Anchor on Apple** for the glass material — feed the newsroom page + one product page.
2. **Feed Heights + Jesse Martinez** for green; instruct Design to substitute your sage palette (`#4B5945` → `#B2C9AD`) for their teal/lime.
3. **Feed Eduard Bodak (+ Fleur Moreau if live)** for scroll feel; say "smooth GSAP/Lenis-style scroll, no hijack; vertical scroll triggers lateral section drift like Fleur Moreau."
4. **Use Cole** as the structural skeleton.
5. **Sequence:** Apple glass + sage palette first → check white-on-sage contrast (target 4.5:1) → add scroll motion last so performance stays smooth.

## Caveats
- No single live site combines all four qualities — references are split by quality on purpose.
- Verified live by direct fetch: jessemartinezdesign.com, derekcole.framer.website, onepagelove.com/style/glassmorphism, the Apple newsroom page. Verified via research: heights.agency. SOTD-listed but confirm current resolution yourself: eduardbodak.com, fleurmoreau.com, activetheory.net.
- "Green" on live examples is teal/forest/lime, not muted sage — supply the sage palette yourself.
- Dribbble/Behance/Figma "green glassmorphism" results are concepts, not live sites — visual mood only.
- Apple's Liquid Glass can't be reproduced 1:1 in CSS — approximate with `backdrop-filter` blur + semi-transparent tint + subtle borders; avoid over-blur and low contrast.
