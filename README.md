# Workspace Builder · monis.rent

An interactive tool for digital nomads and startups in Bali to **design their dream workspace visually** — pick a desk, choose a chair, add monitors, a lamp, a plant — watch the setup come to life, then rent it in one tap.

> 🚧 Work in progress — the write-up (approach, tech choices, future improvements) is added in the final batch.

**Live demo:** _coming soon_

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
│   ├── preview/  #   live workspace scene
│   └── checkout/ #   summary bar + checkout flow
└── lib/          # pure helpers (price formatting, quote calculation)
```

## Pricing model

Mirrors monis.rent: prices are in **USD**, billed **weekly or monthly**, and the monthly
plan is roughly 30–40% cheaper than paying weekly. Money is stored as integer cents to
avoid floating-point rounding errors. Catalog prices are illustrative, calibrated to
monis.rent's published "from" prices.

## State management

The setup lives in a single `useReducer` exposed through React context
(`src/features/workspace`). No state library is needed at this size, and the reducer is a
pure function that is tested without rendering anything.

- **Rules**: one desk and one chair; each accessory has a max quantity; all monitors
  combined must fit the desk (switching to a smaller desk trims extra monitors).
- **Separate contexts** for state and actions, so components that only dispatch never re-render.
- **Persistence**: the setup is saved to `localStorage` and validated when it's loaded back,
  so a corrupt value or a removed product never breaks the app.
