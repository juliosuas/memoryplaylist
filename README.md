# 🎵 Fryda — Memory Playlist

**Every memory has its song.**

Fryda transforms your photos and memories into personalized playlists. Upload a photo, describe how you felt, and AI analyzes the visual elements — colors, scenes, mood, lighting — to generate a perfectly curated soundtrack for that moment.

## ✨ Features

- **📸 AI Photo Analysis** — Computer vision extracts mood, scene, lighting, colors, and energy from your photos
- **🎭 Emotion Detection** — AI-powered emotion analysis from text descriptions
- **🎵 Smart Playlist Generation** — 25-track playlists scored by mood, moment type, visual analysis, and genre matching
- **🔍 Artist & Song Search** — Tag specific artists or songs to influence recommendations
- **🎚️ Discovery Slider** — Control the balance between familiar favorites and new discoveries
- **🌙 Dark Mode** — Full light/dark theme support
- **📱 Mobile-First** — Responsive design optimized for mobile
- **🎉 Celebration UI** — Confetti animations and personalized closing messages per emotion
- **🔗 Multi-Platform Export** — Open playlists directly in YouTube, Spotify, or Apple Music
- **📤 Share** — Share your generated playlists with friends

## 🏗️ Architecture

### Frontend
- **React 18** + TypeScript + Vite
- **Tailwind CSS** + shadcn/ui components
- **Sonner** for toast notifications
- **canvas-confetti** for celebration effects
- **localStorage** for client-side playlist persistence

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
| `playlists` | Generated playlists linked to experiences |
| `playlist_tracks` | Individual tracks within playlists |
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

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `LOVABLE_API_KEY` | AI Gateway key (Edge Functions) |

## 📁 Project Structure

```
src/
├── components/
│   ├── fryda/           # Custom Fryda components
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
│   ├── playlistGenerator.ts  # Smart scoring algorithm
│   └── utils.ts
└── pages/
    ├── Index.tsx
    └── NotFound.tsx

supabase/
├── functions/
│   ├── analyze-photo/   # AI photo analysis + music profile
│   └── analyze-emotion/ # AI emotion detection + playlist creation
└── migrations/          # SQL migrations with RLS, indexes, rate limiting
```

## 🎨 Supported Moods

Enamorado ❤️ · Nostálgico 🥲 · Feliz 😀 · Relajado 😌 · Nervioso 😬 · Triste 😢 · Reflexivo 💭 · Motivado 💪 · Rapero 🎤 · Esperanzado 🌈 · Libre 😎

## 📄 License

Private project. All rights reserved.

---

*Built with ❤️ for reliving special moments through music.*
