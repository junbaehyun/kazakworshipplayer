# Kazakh Worship Player — UI/UX Specification (Apple Music Day-Theme Mobile Spec)

> **Design Benchmark**: **Apple Music (iOS Light / Day Theme Only)**  
> **Viewport Constraint**: **Mobile-Only (`max-w-[430px]` centered mobile app shell)** — No desktop multi-column layouts, no dark mode toggle.  
> **Languages**: Kazakh (`KK`), Korean (`KO`), English (`EN`), Russian (`RU`).

---

## 1. Visual Design System (Apple Music Day Theme)

### Strict Theme Rules
1. **Day Theme (Light Mode) Only**: Never render dark mode surfaces (`#0F172A`, `bg-slate-900`, etc.) for the app background. Always use bright, airy Apple Music daylight surfaces.
2. **Mobile-Only Shell (`max-w-[430px]`)**: The entire app lives inside a single mobile column (`max-w-[430px] mx-auto min-h-screen bg-white shadow-sm`), behaving identically to a native iOS/Android mobile music app.

### Color Tokens
| Token | Role | Hex / Tailwind | Apple Music Visual Intent |
| :--- | :--- | :--- | :--- |
| **Canvas White** | Primary App Surface | `#FFFFFF` (`bg-white`) | Clean, high-contrast Apple Music background. |
| **Grouped Gray** | Secondary Surface / Cards / Inputs | `#F5F5F7` (`bg-[#F5F5F7]`) | Used for search bars, notice cards, and form inputs. |
| **Frosted Chrome** | Floating Mini-Player & Tab Bar | `rgba(255,255,255,0.88)` + `backdrop-blur-xl` | Signature Apple Music translucent floating player & bottom dock. |
| **Apple Music Rose** | Primary Brand & Active Control | `#FA243C` (`text-[#FA243C]` / `bg-[#FA243C]`) | Signature Apple Music accent for active tabs, play icons, repeat/shuffle active states. |
| **Steppe Sky Accent** | Kazakh Cultural Sub-Accent | `#007AFF` / `#0284C7` | Used on album art gradients and offline saved badges. |
| **Ink Primary** | Main Titles & Song Names | `#1D1D1F` | Crisp Apple system typography contrast. |
| **Ink Secondary** | Subtitles, Artists, Timestamps | `#86868B` | Muted metadata & lyrics secondary lines. |
| **Hairline Divider** | Song Row Separator | `rgba(0,0,0,0.06)` | Inset hairline divider between song list items. |

---

## 2. Mobile Screen Architecture (Apple Music Style)

```text
+---------------------------------------------+  <- max-w-[430px] Mobile Shell
|  Қазақша Мадақ          [KK|KO|EN|RU]  [+]  |  <- Sticky Translucent Top Bar
|  Тыңдау (Listen Now)                        |  <- Apple Music Large Title
+---------------------------------------------+
|  [🔍 Ән атын немесе сөзін іздеу...       ]  |  <- #F5F5F7 Rounded Search Pill
+---------------------------------------------+
|  ℹ️ Авторлық құқық хабарландыруы   [Ашу >]  |  <- Compact Notice Banner
+---------------------------------------------+
|  ТОП ЧАРТ (MOST PLAYED)          Барлығы >  |
|  +------------------+  +------------------+ |
|  | [Art #1]         |  | [Art #2]         | |  <- Horizontal Featured Cards
|  | Ұлы Құдай        |  | Алғыс айтамын    | |
|  | 1,248 рет        |  | 982 рет          | |
|  +------------------+  +------------------+ |
+---------------------------------------------+
|  БАРЛЫҚ ӘНДЕР (ALL SONGS)     [▶ Play] [🔀] |
|  -----------------------------------------  |
|  [🎨] 1  Ұлы Құдай                 [↓] [•••]|
|          Белгісіз автор · 04:12             |
|  -----------------------------------------  |
|  [🎨] 2  Алғыс айтамын Саған       [↓] [•••]|
|          Белгісіз автор · 03:45             |
+---------------------------------------------+
| +-----------------------------------------+ |  <- Floating Frosted Mini-Player
| | [🎨] Ұлы Құдай                [⏸]  [⏭] | |     (Tap to expand Full Player)
| +-----------------------------------------+ |
+---------------------------------------------+
|   🎵 Тыңдау   🏆 Чарт   📥 Офлайн   ☁️ Жүктеу |  <- Native Bottom Tab Bar
+---------------------------------------------+
```

---

## 3. Apple Music Interactive Patterns to Imitate

1. **Play & Shuffle Pill Buttons**:
   - Below the section header, provide two side-by-side rounded buttons on `#F5F5F7` background with `#FA243C` icons: **`▶ Ойнату (Play)`** and **`🔀 Араластыру (Shuffle)`**.
2. **Floating Mini-Player Pill**:
   - Floats 8px above the bottom tab bar (`rounded-2xl bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-black/5`).
   - Shows 40×40 rounded artwork, song title, play/pause button, and next track button, plus a thin bottom progress bar.
   - **Tapping the Mini-Player** slides up the **Full-Screen Now Playing Sheet**.
3. **Full-Screen Now Playing Sheet (Slide-Up Modal)**:
   - Top grabber pill (`w-10 h-1.5 rounded-full bg-black/15`).
   - Large square album art (`rounded-2xl shadow-2xl`) that smoothly scales (`scale-100` when playing, `scale-90` when paused — signature Apple Music micro-interaction).
   - Song title + Artist (`Белгісіз автор`) + `•••` button (opens "Claim Authorship / Request Removal" action sheet).
   - Interactive scrub bar with current time and remaining time (`-02:58`).
   - Large tactile transport controls (`⏮`, `▶/⏸`, `⏭`).
   - Bottom utility bar: **Lyrics (`💬`)**, **Repeat (`🔁` Off / All / One)**, **Shuffle (`🔀`)**, and **Offline Cache (`↓ IndexedDB`)**.

---

## 4. Complete 4-Language (`KK` / `KO` / `EN` / `RU`) Translation Matrix

| Key | 🇰🇿 Kazakh (`kk`) | 🇰🇷 Korean (`ko`) | 🇺🇸 English (`en`) | 🇷🇺 Russian (`ru`) |
| :--- | :--- | :--- | :--- | :--- |
| `appTitle` | Қазақша Мадақ | 카자흐 찬양 | Kazakh Worship | Казахские Песни |
| `tabListen` | Тыңдау | 지금 듣기 | Listen Now | Слушать |
| `tabTopChart` | Топ Чарт | 인기 차트 | Top Charts | Топ Чарт |
| `tabOffline` | Офлайн | 보관함 | Offline | Офлайн |
| `tabUpload` | Жүктеу | 업로드 | Upload | Загрузить |
| `btnPlayAll` | Ойнату | 재생 | Play | Слушать |
| `btnShuffleAll` | Араластыру | 임의 재생 | Shuffle | Перемешать |
| `searchPlaceholder` | Ән атын немесе сөзін іздеу... | 찬양 제목 또는 가사 검색... | Search songs or lyrics... | Поиск песен или текста... |
| `unknownAuthor` | Белгісіз автор | 작자 미상 | Unknown Author | Неизвестный автор |
| `sharedWithPermission` | Рұқсатпен бөлісілген | 공유 허락됨 | Shared with Permission | Разрешено к распространению |
| `playsCount` | тыңдалды | 회 재생 | plays | прослушиваний |
| `saveOffline` | Жүктеп алу | 기기 저장 | Save Offline | Скачать |
| `savedOffline` | Сақталған | 저장됨 | Downloaded | Скачано |
| `bannerShort` | Авторы белгісіз және еркін бөлісілетін әндер туралы | 작자 미상 및 무료 나눔 찬양 안내 | Unknown Authors & Free Sharing Notice | О песнях с неизвестным автором |
| `bannerBody` | Бұл қосымшада тек еркін бөлісуге рұқсат етілген немесе авторы белгісіз қазақша мадақ әндері жинақталған. Егер сіз әннің авторы болсаңыз немесе әнді өшіруді сұрасаңыз, бізге хабарласыңыз. | 이 앱은 나눔이 허락되었거나 원작자를 알 수 없는 카자흐어 찬양곡만 비상업적 예배 목적으로 공유합니다. 원작자 성함 표기나 삭제를 원하시면 언제든 요청해 주세요. | This app shares Kazakh worship songs permitted for free sharing or whose original authors are unknown. Strictly non-commercial. If you are an author and wish to be credited or request removal, please notify us. | В приложении собраны казахские песни хвалы, разрешенные для свободного распространения, либо песни с неизвестным автором. Если вы автор и хотите указать имя или удалить песню, сообщите нам. |
| `btnReportClaim` | Авторды хабарлау / Өшіру | 저작자 제보 / 삭제 요청 | Claim Author / Remove | Сообщить об авторе / Удалить |
| `uploadConsent` | Бұл қазақша мадақ әні екенін және оны еркін бөлісуге рұқсат берілгенін (немесе авторы белгісіз екенін) растаймын. | 이 곡은 공유가 허락되었거나 작자 미상인 카자흐 찬양곡임을 확인합니다. | I confirm this is a Kazakh worship song permitted for sharing or has an unknown author. | Подтверждаю, что песня разрешена для свободного распространения или её автор неизвестен. |
