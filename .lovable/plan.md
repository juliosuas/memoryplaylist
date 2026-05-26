# VibePlaylist contest readiness plan

## Goal

Prepare the app for the Lovable contest under the public name **VibePlaylist** while keeping **Fryda** as the useful in-product personality and music guide.

## Public positioning

- First viewport should say **VibePlaylist** clearly.
- Fryda remains in supporting copy as the guide that reads the memory and suggests music.
- Metadata, social previews, README, and submission notes should use **VibePlaylist**.
- Copy must stay honest: the app generates a local AI-guided tracklist and opens music-service searches/actions. It does not write real playlists into Spotify or Apple Music accounts.

## Current release gates

- [x] First viewport names VibePlaylist.
- [x] `index.html` title, description, OG, and Twitter metadata name VibePlaylist.
- [x] User-facing service actions avoid implying Spotify/Apple playlist creation.
- [x] README contains contest evidence placeholders.
- [x] README explicitly discloses Spotify/Apple are search/open actions.
- [x] `npm run lint` result recorded: PASS on 2026-05-26 with 7 existing shadcn fast-refresh warnings.
- [x] `npm run build` result recorded: PASS on 2026-05-26.
- [x] No push, deploy, or Lovable sync until Julio asks for it.

## Submission evidence placeholders

- Lovable project URL: `https://lovable.dev/projects/7ed0e517-fcb5-47f2-b33f-a3016ba3167b`
- Public demo URL: `Pending Lovable publish`
- Desktop screenshot: `TODO`
- Mobile screenshot: `TODO`
- Demo video/GIF: `TODO`
- Final lint result: `npm run lint` PASS on 2026-05-26; 7 existing shadcn fast-refresh warnings
- Final build result: `npm run build` PASS on 2026-05-26
- Supabase Edge Functions production status: `Not confirmed before Lovable publish; app has local fallback tracklist generation`

## Scope guard

Allowed for this pass:

- `index.html`
- `README.md`
- `.lovable/plan.md`
- Small copy-only frontend changes in `src/pages/Index.tsx` or visible labels

Do not change for this pass:

- Supabase functions
- package files
- `localPlaylistStore`
- broad layout redesign
- deploy or Lovable sync
