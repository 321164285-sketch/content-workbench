# Content Workbench

A lightweight **content management dashboard** built with **React + TypeScript**, demonstrating a full front-end workflow: REST API integration, global state management, responsive UI, and interactive data visualization.

## Features

- **Dashboard** — KPI cards (total / published / draft / archived with share ratios), a 6-month publishing trend line chart, category distribution donut chart, and a latest-content table.
- **Calendar View** — month grid with content-count badges per day; click any date to see that day's contents in a side panel. Supports month navigation and a "today" shortcut.
- **Content Management** — full CRUD: title search, category/status filters, pagination, create/edit dialog with validation, and delete confirmation.

## Tech Stack

- **React 18 + TypeScript** (Vite build tool)
- **REST API**: [JSONPlaceholder](https://jsonplaceholder.typicode.com) `/posts` (GET) with graceful fallback to local seed data when offline
- **State management**: React Context + hooks, with `localStorage` persistence for local CRUD overrides (refresh-safe)
- **Charts**: Recharts (LineChart, PieChart)
- **Routing**: React Router (HashRouter — works on GitHub Pages without server rewrites)

## Getting Started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to ./dist
```

## Deploy to GitHub Pages

This project uses **HashRouter**, so it works on GitHub Pages without extra configuration.

1. Push the code to your GitHub repository.
2. In repo **Settings → Pages**, set **Source** to `GitHub Actions`.
3. Add the workflow file `.github/workflows/deploy.yml` (see below), or use any static-site host (Vercel / Netlify) with `dist` as the publish directory.

## Project Structure

```
src/
├── api/content.ts          # REST API layer + seed data fallback
├── context/ContentContext.tsx  # Global state (Context) + localStorage persistence
├── pages/
│   ├── Dashboard.tsx       # KPIs + charts + latest table
│   ├── Calendar.tsx        # Month calendar with content badges
│   └── Content.tsx         # CRUD list with search/filter/pagination/dialog
├── types.ts                # Shared IContent types
└── App.tsx                 # Layout + routing
```

## Why This Project

Built as a portfolio piece for a Front-end Developer application — it shows end-to-end thinking (API → state → UI), component-based design, REST integration, and a polished, responsive admin UI.
