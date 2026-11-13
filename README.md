# Қазақша Мадақ Әндері — Kazakh Worship Player

A mobile-first Web App (PWA) for listening to and sharing Kazakh worship songs (`Қазақша мадақ әндері`), featuring a **Most Played Chart**, **Background Lock-Screen Playback**, **Offline Local Storage (`IndexedDB`)**, **Community Song Uploads**, and **4-Language Support (`KK` | `KO` | `EN` | `RU`)**.

---

## Documentation & Blueprint (Start Here)

- **[AI Agent Guide (`AGENTS.md`)](./AGENTS.md)** — Instructions & rules so any AI assistant can continue development seamlessly.
- **[Technical Blueprint (`docs/BLUEPRINT.md`)](./docs/BLUEPRINT.md)** — Architecture, shared Supabase isolation strategy (`kwp_`), audio engine, and roadmap.
- **[UI/UX Specification (`docs/UI_UX_SPEC.md`)](./docs/UI_UX_SPEC.md)** — Wireframes, design tokens, user flows, and complete 4-language (`KK`, `KO`, `EN`, `RU`) dictionary.
- **[Shared Supabase SQL (`docs/SUPABASE_SETUP.sql`)](./docs/SUPABASE_SETUP.sql)** — Safe, non-destructive SQL script (`kwp_` prefixed) to add tables and storage policies to an existing Supabase project.
- **[Interactive UI/UX Preview (`docs/ui-preview.html`)](./docs/ui-preview.html)** — Self-contained interactive prototype of all screens and features.

---

## Key Features

1. **4 Languages (`KK` / `KO` / `EN` / `RU`)**: Instant language toggle in the header.
2. **Full Music Player**: Play/Pause, Seek bar, Next/Prev, Repeat (`Off` / `All` / `One`), Shuffle, and Lock-Screen (`MediaSession`) background audio support.
3. **Most Played Chart (`Көп тыңдалған / 인기 차트`)**: Real-time leaderboard ranked by play count.
4. **Dual Storage (Shared Supabase + Local `IndexedDB`)**:
   - Connects to your existing Supabase project using isolated `kwp_` tables and a `kwp-audio/` storage folder.
   - Users can save songs to browser `IndexedDB` for 100% offline playback.
5. **Copyright & Unknown Author Announcement**: Prominent notice explaining that songs are shared non-commercially with permission or have unknown authors, complete with an in-app **Claim Authorship / Request Removal** reporting flow.
