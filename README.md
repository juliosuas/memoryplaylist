# Memory Playlist

**Every memory has its song.**

Memory Playlist turns a photo into an AI-guided music recommendation list. It reads the mood, scene, energy, and visual cues, then suggests tracks that fit the moment.

Important product truth: Memory Playlist does not create real playlists inside Spotify. It generates a local tracklist and opens YouTube/Spotify actions so users can review and save songs in the service they prefer.

## Lovable Positioning

- Public name in the app: **Memory Playlist**
- Demo promise: upload a memory photo, get a scored tracklist, share the result, and open YouTube/Spotify actions
- Non-goal for this build: native Spotify playlist creation or account-connected music writes

## ✨ Features

- **📸 AI Photo Analysis** — Computer vision extracts mood, scene, lighting, colors, and energy from your photos
- **🎵 Smart Tracklist Generation** — 25 recommended tracks scored by mood, moment type, visual analysis, and genre matching
- **🔍 Artist & Song Search** — Tag specific artists or songs to influence recommendations
- **🌙 Dark Mode** — Full light/dark theme support
- **📱 Mobile-First** — Responsive design optimized for mobile
- **🎉 Celebration UI** — Confetti animations and personalized closing messages per emotion
- **🔗 Music Open Actions** — Open YouTube playback where IDs exist, or open Spotify searches for the recommended songs
- **📤 Basic Share** — Copy the generated tracklist or a portable restore link

## 🏗️ Architecture

### Frontend
- **React 18** + TypeScript + Vite
- **Tailwind CSS** + shadcn/ui components
- **Sonner** for toast notifications
- **canvas-confetti** for celebration effects
- **localStorage** for client-side tracklist persistence

### Backend (Supabase)
- **PostgreSQL** with Row Level Security (RLS) on all tables
- **Edge Functions** for AI analysis (photo + emotion detection)
- **Storage Buckets** for experience photos
- **Rate Limiting** via atomic `check_rate_limit()` function

### AI Pipeline
- **Gemini 2.5 Flash** via Lovable AI Gateway
- Photo → visual analysis (colors, scene, mood, energy, season, time of day)
- Description → emotion detection (Spanish-language)
- Combined profile → playlist scoring algorithm

## 📊 Database Schema

| Table | Description |
|---|---|
| `user_profiles` | User display names and metadata |
| `experiences` | Photo + description entries with detected emotions |
| `playlists` | Generated local tracklists linked to experiences |
| `playlist_tracks` | Individual tracks within generated local tracklists |
| `music_preferences` | User track likes/dislikes for personalization |
| `rate_limits` | Request tracking for Edge Function rate limiting |

All tables have RLS enabled. Users can only access their own data.

## 🔒 Security

- **Row Level Security** on every table — users only see their own data
- **Storage policies** — photos scoped to user folders
- **Rate limiting** — analyze-photo: 5/min, analyze-emotion: 10/min per user
- **Input validation** — server-side checks on file size (10MB), content types, text length (2000 chars), UUID format
- **Content-Type enforcement** — Edge Functions reject non-JSON requests

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase project (or local Supabase CLI)

### Setup

```bash
# Clone
git clone https://github.com/juliosuas/memoryplaylist.git
cd memoryplaylist

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase URL and anon key

# Run migrations
npx supabase db push

# Start dev server
npm run dev
```

### Environment Variables

Copy `.env.example` for local development. In Lovable, set the `VITE_` variables in Project Settings → Environment Variables.

| Variable | Where | Required | Description |
|---|---|---:|---|
| `VITE_SUPABASE_URL` | Lovable/Vite frontend | Yes for live photo AI | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Lovable/Vite frontend | Yes for live photo AI | Supabase anon/public key |
| `LOVABLE_API_KEY` | Supabase Edge Function secret | Optional fallback-safe | AI Gateway key used server-side only |

If Supabase Edge Functions or `LOVABLE_API_KEY` are unavailable, Memory Playlist intentionally fails open: the frontend still creates a local generated tracklist and opens it in YouTube or Spotify search.

## Contest Evidence Checklist

Use this section as the submission-facing evidence log. Replace placeholders with the final URLs/screenshots before submitting.

- Lovable project URL: `https://lovable.dev/projects/7ed0e517-fcb5-47f2-b33f-a3016ba3167b`
- Public demo URL: `Pending Lovable publish`
- Desktop screenshot: `TODO`
- Mobile screenshot: `TODO`
- Demo video/GIF: `TODO`
- Final build command: `npm run build` — PASS on 2026-05-26
- Final lint command: `npm run lint` — PASS on 2026-05-26 with 7 existing shadcn fast-refresh warnings
- Final local e2e command: `npm run test:e2e:local` — PASS on 2026-05-26; YouTube, Spotify, share restore, and console checks passed
- Supabase Edge Functions configured in production: `Not confirmed before Lovable publish; app has local fallback tracklist generation`
- Known limitation disclosed: Spotify action is a search/open action, not account-connected playlist creation

## Release Gates

- First viewport uses the simpler **Memory Playlist** design.
- Product copy does not claim real Spotify playlist creation.
- YouTube/Spotify actions are labeled as open/search actions.
- README evidence placeholders are filled before contest submission.
- `npm run lint` passes or every warning/error is documented. Current result: PASS with 7 existing shadcn fast-refresh warnings.
- `npm run build` passes. Current result: PASS.
- `npm run test:e2e:local` passes against Vite preview. Current result: PASS.
- No Supabase function, package, or local playlist store changes are required for contest copy readiness.

## 📁 Project Structure

```
src/
├── components/
│   ├── memoryplaylist/           # Memory Playlist personality and music-guide components
│   │   ├── ArtistSearch.tsx
│   │   ├── DiscoverySlider.tsx
│   │   ├── FormSection.tsx
│   │   ├── GenerateButton.tsx
│   │   ├── MomentSelector.tsx
│   │   ├── MoodSelector.tsx
│   │   ├── PhotoUpload.tsx
│   │   ├── PlaylistLoader.tsx
│   │   └── SharePlaylist.tsx
│   ├── ui/              # shadcn/ui primitives
│   ├── ExperienceForm.tsx
│   ├── PlaylistResult.tsx
│   └── SettingsDialog.tsx
├── data/
│   └── tracks.ts        # Track catalog with mood/genre/visual metadata
├── integrations/
│   └── supabase/        # Auto-generated client + types
├── lib/
│   ├── api.ts           # Typed API helper layer
│   ├── error-handler.ts # Centralized bilingual error handling
│   ├── playlistGenerator.ts  # Smart track scoring algorithm
│   └── utils.ts
└── pages/
    ├── Index.tsx
    └── NotFound.tsx

supabase/
├── functions/
│   ├── analyze-photo/   # AI photo analysis + music profile
│   └── analyze-emotion/ # AI emotion detection + recommendation generation
└── migrations/          # SQL migrations with RLS, indexes, rate limiting
```

## 🎨 Supported Moods

Enamorado ❤️ · Nostálgico 🥲 · Feliz 😀 · Relajado 😌 · Nervioso 😬 · Triste 😢 · Reflexivo 💭 · Motivado 💪 · Rapero 🎤 · Esperanzado 🌈 · Libre 😎

## 📄 License

Private project. All rights reserved.

---

*Built for reliving special moments through music.*
