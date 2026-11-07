# Workspace Builder · monis.rent

An interactive tool for digital nomads and startups in Bali to **design their dream workspace visually** — pick a desk, choose a chair, add monitors, a lamp, a plant — watch the setup come to life, then rent it in one tap.

**Live demo:** https://workspace-builder-swart.vercel.app

## Write-up

### Approach

I designed for the person in the brief: a freelancer who has just landed in Bali and wants
a working setup by next week. They should *see* their office, not scroll a catalogue. So the
live scene is the centre of the page, the picker sits beside it, the price is always visible
in a sticky bar, and "Rent your setup" switches on once there's a desk and a chair.

Before writing code I looked at monis.rent itself. It bills in **USD, weekly or monthly**,
with monthly roughly 30–40% cheaper, and delivers next day across Bali. The pricing model,
the weekly/monthly switch, the "Save X%" badges and the delivery step all follow that.
Product prices are illustrative because the site doesn't show item prices publicly.

For the visuals I drew my own SVG artwork instead of using monis.rent product photos.
Photos taken from different angles can't be stacked into one believable scene. SVG pieces
can: they share a perspective, scale cleanly, weigh almost nothing and can be animated. The
same artwork doubles as the product thumbnails, so the cards match what appears in the scene.

I built it in small, reviewable steps, each a PR with tests: scaffold → catalog, pricing &
CI → state → picker → live preview → checkout → quick-start setups & share links →
accessibility, performance and mobile polish.

### Tech choices

- **React 19 + TypeScript + Vite.** Product ids are literal types derived from the catalog,
  so a typo in an id, or a product without artwork, is a compile error rather than a blank
  spot in the scene.
- **`useReducer` + context instead of a state library.** The setup is one small object. The
  reducer and its business rules (one desk and chair, per-item limits, monitors capped by
  desk width) are pure functions, tested without rendering anything.
- **A pure layout function for the scene** (`layout.ts`) turns the setup into coordinates, so
  the hard part of the preview is unit-tested and the drawing code stays simple.
- **Native `<dialog>` for checkout** gives focus trapping, Esc to close and an inert
  background for free. No modal library needed.
- **Plain CSS for motion** (pop-in, glide), switched off for users who prefer reduced motion.
  No animation library: the app ships at about 84 kB of gzipped JS, and checkout is split
  into its own 5 kB chunk that loads only when someone goes to rent.
- **Tailwind CSS v4** with a small Bali palette (jungle, sunset, sand) as theme tokens.
- **Quality:** 501 Vitest + React Testing Library tests (unit, component and full-app flows,
  including 300 seeded runs of the random-setup generator), automated axe accessibility
  checks, oxlint, and GitHub Actions CI on every PR. Lighthouse scores 100 for performance,
  accessibility, best practices and SEO on both mobile and desktop.

### Trade-offs

- **Sending a rental request is simulated.** There is no monis.rent API to call, so
  `submitRentalRequest` (`src/features/checkout/api.ts`) waits a moment and returns a
  reference number. It's the one function to replace with a real integration.
- **A 2D front view, not 3D.** It reads well on a phone and stays light, but you can't rotate
  the room or drag items around.
- **The catalog lives in code** (`products.ts`), and the setup is saved only in the
  browser (`localStorage`), so it doesn't follow the user between devices. Share links carry
  the whole setup in the URL instead, so they need no server but aren't short.

### What I'd improve with more time

- **Make the request real.** Either open WhatsApp with the order pre-filled (closest to how
  monis.rent works today), or send it through a small Vercel function that emails the team.
- **Load the catalog from monis.rent's CMS**, with live prices, stock and bundle discounts,
  instead of a static file.
- **Bundles and short links:** apply monis.rent's bundle discount to the ready-made setups,
  and store shared setups server-side for short, tidy links.
- **More direct editing:** click an item in the scene to swap or remove it, drag to rearrange
  the desk, and add exit animations when something is removed.
- **More testing and measurement:** Playwright end-to-end and visual-regression tests for the
  scene, Lighthouse in CI, and funnel analytics to see where people drop off before renting.

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) on [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com) with a custom Bali-inspired theme (`src/index.css`)
- [lucide-react](https://lucide.dev) icons
- [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) (jsdom) for unit and component tests, [oxlint](https://oxc.rs) for linting
- GitHub Actions CI (lint → test → type-check + build) on every PR
- Deployed on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
npm run build     # type-check and build for production
npm run preview   # serve the production build locally
npm run lint      # lint with oxlint
npm test          # run unit tests once (npm run test:watch to watch)
npm run typecheck # type-check without building
```

Requires Node 22.12+ (see `.nvmrc`).

## Project structure

```
src/
├── components/   # shared, app-wide UI (layout, primitives)
├── config/       # site/brand constants
├── features/     # feature modules
│   ├── catalog/  #   product types, catalog data and lookups
│   ├── workspace/#   setup state: reducer, rules, selectors, persistence
│   ├── builder/  #   product picker: accessible tabs, product cards, quantity steppers
│   ├── preview/  #   live SVG scene: artwork, layout engine, animations
│   ├── presets/  #   ready-made setups and "Surprise me"
│   ├── share/    #   share links: encode/decode a setup in the URL
│   └── checkout/ #   summary bar + checkout drawer (review → details → confirmation)
├── lib/          # pure helpers (price formatting, quote calculation)
└── test/         # test helpers (dialog polyfill, seeded random)
```

## How it works

### Pricing model

Mirrors monis.rent: prices are in **USD**, billed **weekly or monthly**, and the monthly
plan is roughly 30–40% cheaper than paying weekly. Money is stored as integer cents to
avoid floating-point rounding errors. Catalog prices are illustrative, calibrated to
monis.rent's published "from" prices.

### State management

The setup lives in a single `useReducer` exposed through React context
(`src/features/workspace`). No state library is needed at this size, and the reducer is a
pure function that is tested without rendering anything.

- **Rules**: one desk and one chair; each accessory has a max quantity; all monitors
  combined must fit the desk (switching to a smaller desk trims extra monitors).
- **Separate contexts** for state and actions, so components that only dispatch never re-render.
- **Persistence**: the setup is saved to `localStorage` and validated when it's loaded back,
  so a corrupt value or a removed product never breaks the app.

### Live preview

The workspace is a hand-drawn SVG scene (`src/features/preview`) that redraws from the
setup state, with no images to load and crisp at any size.

- **One artwork per product**, keyed by product id (`art/registry.ts`). Adding a product
  without artwork is a compile error. The same artwork is used for the product-card thumbnails.
- **Layout is a pure function** (`layout.ts`) that turns the setup into positions:
  desks are drawn to scale from their real widths, monitors share the space the lamp and
  plant leave free and shrink to fit, and a second plant moves to the floor. Unit-tested.
- **Motion with plain CSS**: new items pop in, and moved items glide to their new spot
  (e.g. monitors re-spacing on a wider desk). Both are off when the user has "reduce
  motion" turned on.
- **Accessible**: the scene's accessible name describes the full setup, and a one-line
  summary is announced as it changes.

### Checkout

"Rent your setup" opens a checkout drawer (`src/features/checkout`) in three steps:

1. **Review**: the setup as a receipt, weekly/monthly billing, rental length (1–12 periods) and totals.
2. **Details**: name, email, WhatsApp number, Bali delivery area, address and delivery date
   (next day at the earliest). Fields are checked when you leave them and when you submit;
   errors are announced, and focus jumps to the first problem.
3. **Confirmation**: a reference number and what happens next.

The drawer is a native `<dialog>` opened with `showModal()`, which provides focus trapping,
Esc to close and an inert background without extra libraries. There is no backend, so
`submitRentalRequest` in `api.ts` simulates the request. It is the single place to plug in a
real endpoint or a WhatsApp hand-off.

### Quick start & sharing

- **Ready-made setups** (`src/features/presets`): Nomad Starter, Deep Focus, Triple-Monitor
  Pro and Active Creator load in one tap, each showing its price for the current billing period.
  Loading one over an existing setup offers **Undo**.
- **Surprise me** builds a random setup that always follows the rules (a desk, a chair, at
  least one monitor, nothing over its limits) and always differs from the current one.
- **Share links** (`src/features/share`) keep the setup in readable parameters, e.g.
  `?desk=desk-electric&chair=chair-ergonomic&item=monitor-24-fhd*2`. Opening one loads that
  setup, then removes the parameters from the address bar so a refresh keeps your own edits.
  Links go through the same validation as saved setups, so a hand-edited link can't break the
  app. On phones, Share opens the native share sheet; elsewhere it copies the link.

### Accessibility & performance

- **Colour contrast:** every text colour meets WCAG AA (4.5:1) on the surfaces it's used on.
- **Keyboard and screen readers:** tabs with arrow-key support, labelled controls, announced
  totals and errors, focus moved to each new checkout step. axe-core runs over the builder and
  every checkout step in the test suite.
- **Fast first load:** the font is self-hosted (no render-blocking request to Google), and
  checkout is lazy-loaded and starts downloading when the user hovers or focuses "Rent".
- **Phones:** the preview pins to the top in a compact form, so you see each change while
  scrolling through products.
- **Link previews:** Open Graph and Twitter tags with a 1200×630 image (`public/og-image.png`)
  rendered from the app's own scene.

