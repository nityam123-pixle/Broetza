# Design System

## Theme & Color Strategy

- **Strategy**: Committed — High-contrast hearth-side brand palette with saturated accent colors.
- **Base Background**: `#17100a` / dark hearth backdrop.
- **Primary Accent**: `--base-300: #BC3330` (Bro'etza Red).
- **Secondary Accent**: `--base-100: #374C8C` (Deep Hearth Blue).
- **Text & Display**: `--base-500: #FFFFFF` (Cream / Off-White).

## Typography

- **Display Header**: `Barlow Condensed`, Impact, sans-serif
  - `font-weight: 700` / `800`
  - `text-transform: uppercase`
  - Letter spacing clamp floor: `-0.03em`
- **Body & Controls**: `Instrument Sans`, Arial, sans-serif
  - `font-weight: 400` / `500` / `700`
  - Line height: `1.5`

## Components

- **Header Navbar**: Fixed top, full width, height `6rem` -> `5.5rem` on scroll with compact action button swap.
- **Preloader**: Full-viewport circle curtain reveal expanding from center (`50% 50%`) with Bro'etza logo presentation.
- **Video Scrub Hero**: ScrollTrigger-mapped HTML5 video stage with SplitText animated cue cards and heat progress counter.
- **Interactive Sticky Slider**: Multi-strip image transition slider with scroll pinning.
- **FAQ Accordion**: 2-column layout with split text-fill / text-outline hover animations.
- **Closing Panel CTA**: Full-width Bro'etza Red (`#BC3330`) card with white display headers and direct Zomato/Swiggy ordering buttons.
- **Footer**: ASCII hand canvas rendering with cursor hover cluster highlights, parallax wrapper, and nav link hovers.

## Motion & Interaction Rules

- **Scroll Sync**: Smooth scroll powered by Lenis synced directly to GSAP `ScrollTrigger`.
- **Eased Entrances**: Exponential ease-out curves (`power3.out`, `power2.out`, `back.out(1.7)`).
- **Reduced Motion**: Fallback to instant crossfades and static layouts under `@media (prefers-reduced-motion: reduce)`.
