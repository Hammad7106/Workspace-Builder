# Workspace Builder · monis.rent

An interactive tool for digital nomads and startups in Bali to **design their dream workspace visually** — pick a desk, choose a chair, add monitors, a lamp, a plant — watch the setup come to life, then rent it in one tap.

> 🚧 Work in progress — the write-up (approach, tech choices, future improvements) is added in the final batch.

**Live demo:** _coming soon_

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) on [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com) with a custom Bali-inspired theme (`src/index.css`)
- [lucide-react](https://lucide.dev) icons
- Deployed on [Vercel](https://vercel.com)

## Getting started

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
npm run build     # type-check and build for production
npm run preview   # serve the production build locally
npm run lint      # lint with oxlint
```

## Project structure

```
src/
├── components/   # shared, app-wide UI (layout, primitives)
├── config/       # site/brand constants
├── features/     # feature modules
│   ├── builder/  #   product picker (tabs + product cards)
│   ├── preview/  #   live workspace scene
│   └── checkout/ #   summary bar + checkout flow
└── lib/          # pure helpers (formatting, pricing, …)
```
