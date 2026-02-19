# Second Brain App - Specification

## Overview
- **Purpose:** View docs created during our sessions
- **Vibe:** Mix of Obsidian (markdown) + Linear (clean UI)
- **Stack:** Next.js + Tailwind CSS

## Pages

### 1. Home/Dashboard (`/`)
- Sidebar: Folders (Concepts, Projects, Journal)
- Main: List of documents in selected folder
- Each item shows: title, date, preview

### 2. Document View (`/docs/[slug]`)
- Clean reading view
- Markdown rendered
- Back button

## Design
- Dark mode default
- Minimal, clean typography
- Linear-style sidebar
- Obsidian-style content area

## Tech
- Next.js 14 (App Router)
- Tailwind CSS
- Markdown parser (remark/rehype)
- Static generation from `/workspace-memory/`

## File Structure
```
/second-brain
  /app
    /docs/[slug]/page.tsx
    /page.tsx
    layout.tsx
  /components
  /lib
```

## Implementation Phases
1. Setup Next.js + Tailwind
2. Create sidebar + document list
3. Add markdown rendering
4. Deploy to Vercel/GitHub Pages
