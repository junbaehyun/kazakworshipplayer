# AI Agent Handoff & Engineering Guide (`AGENTS.md`)

> **Read this file first before making any code or database changes.**  
> This document ensures seamless continuity across any AI coding assistant (Antigravity, Claude Code, Cursor, Copilot, Codex).

---

## 1. Project Summary
- **Name**: Kazakh Worship Player (`kazakworshipplayer`)
- **GitHub Owner**: `wnsqo35`
- **Hosting**: Vercel (Static / SPA Web App & PWA)
- **Languages (Mandatory 4-way i18n)**:
  1. `kk` — Kazakh (Қазақша) — Default language
  2. `ko` — Korean (한국어)
  3. `en` — English
  4. `ru` — Russian (Русский)

---

## 2. Critical Architectural Rules

### Rule 1: Shared Supabase Isolation (`kwp_` prefix)
The user is sharing an **existing Supabase project** that already hosts other data/buckets.
- **NEVER** run `DROP TABLE` or modify tables that do not start with `kwp_`.
- Always use:
  - Table `public.kwp_songs`
  - Table `public.kwp_song_reports`
  - RPC `public.kwp_increment_play(target_song_id UUID)`
- For Supabase Storage, always read bucket name from `import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'kazakh-worship'` and prefix uploaded object keys with `import.meta.env.VITE_SUPABASE_STORAGE_FOLDER || 'kwp-audio'` (e.g., `kwp-audio/1731470000-uly-qudai.mp3`).
- See [docs/SUPABASE_SETUP.sql](file:///Users/godiswithyou/Projects/kazakworshipplayer/docs/SUPABASE_SETUP.sql) for the exact schema.

### Rule 2: Dual Storage Mode (Supabase + Browser `IndexedDB`)
- **Offline Caching (`IndexedDB`)**: Users can download/save any song into browser `IndexedDB` (`kwp_offline_db`) so songs play offline without internet.
- **Local-First Fallback**: If `VITE_SUPABASE_URL` is not configured yet, the app must seamlessly store uploaded songs, audio blobs, and play counts in `IndexedDB` + `localStorage` so the app is 100% functional locally and in previews.

### Rule 3: Singleton Audio Engine & Background Playback
- Use a **single** persistent HTML5 `<audio>` element across the entire lifecycle of the app.
- Wire `navigator.mediaSession` (`metadata` + `setActionHandler` for `play`, `pause`, `previoustrack`, `nexttrack`, `seekto`) so background playback and lock-screen media controls work on Android & iOS.
- Support **Repeat Off**, **Repeat All**, **Repeat One**, and **Shuffle**.

### Rule 4: Copyright & Unknown Author Announcement
- Many Kazakh worship songs in this collection have unknown authors or were orally/communally permitted for sharing.
- The UI must always provide:
  1. A clear announcement banner explaining non-commercial worship sharing and unknown authorship.
  2. A one-click **"Claim Authorship / Request Removal"** button on every song so original authors can be credited or request immediate takedown.

### Rule 5: UI/UX — Day Theme Only, Mobile-Only (`max-w-[430px]`), Apple Music Aesthetic
- **Day Theme (Light Mode) Only**: Pure white (`#FFFFFF`) background with `#F5F5F7` secondary cards, `#FA243C` Apple Music coral-rose accent, crisp `#1D1D1F` text, and frosted glass (`backdrop-blur-xl bg-white/85`) mini-player & bottom tab bar. No dark theme.
- **Mobile-Only Shell**: Constrain the layout to a centered mobile viewport (`max-w-[430px] mx-auto min-h-screen bg-white`).
- **Apple Music Patterns**:
  - Large editorial page headers, side-by-side `▶ Play` and `🔀 Shuffle` pills, rounded square album artwork with subtle shadows, inset hairline dividers, a floating mini-player bar above the bottom tab bar, and a slide-up Full-Screen Now Playing sheet with scaling album art (`scale-100` playing / `scale-90` paused) and synced lyrics view.

---

## 3. Key Reference Documents
1. [docs/BLUEPRINT.md](file:///Users/godiswithyou/Projects/kazakworshipplayer/docs/BLUEPRINT.md) — Architecture, data flow, audio engine spec, and implementation phases.
2. [docs/UI_UX_SPEC.md](file:///Users/godiswithyou/Projects/kazakworshipplayer/docs/UI_UX_SPEC.md) — Color tokens, wireframes, user flows, and complete 4-language (`KK`, `KO`, `EN`, `RU`) translation table.
3. [docs/SUPABASE_SETUP.sql](file:///Users/godiswithyou/Projects/kazakworshipplayer/docs/SUPABASE_SETUP.sql) — Idempotent SQL migration script for the shared Supabase project.
4. [docs/ui-preview.html](file:///Users/godiswithyou/Projects/kazakworshipplayer/docs/ui-preview.html) — Self-contained interactive HTML UI/UX prototype showing all screens, language switcher, player controls, chart, offline storage, upload modal, and copyright notice.
