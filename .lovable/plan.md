# Memory Playlist contest readiness plan

## Goal

Prepare the app for the Lovable contest under the public name **Memory Playlist** while keeping the flow intentionally simple: photo upload, optional music taste, generated tracklist, music-service open/search actions, and basic sharing.

## Public positioning

- First viewport should say **Memory Playlist** clearly.
- Memory Playlist remains the visible brand throughout the simple flow.
- Metadata, social previews, README, and submission notes should use **Memory Playlist**.
- Copy must stay honest: the app generates a local AI-guided tracklist and opens music-service searches/actions. It does not write real playlists into Spotify or Apple Music accounts.

## Current release gates

- [x] First viewport names Memory Playlist.
- [x] `index.html` title, description, OG, and Twitter metadata name Memory Playlist.
- [x] User-facing service actions avoid implying Spotify/Apple playlist creation.
- [x] README contains contest evidence placeholders.
- [x] README explicitly discloses Spotify/Apple are search/open actions.
- [x] UI rolled back to the previous simple card-based flow on 2026-05-26.
- [x] `npm run lint` result recorded: PASS on 2026-05-26 with 7 existing shadcn fast-refresh warnings.
- [x] `npm run build` result recorded: PASS on 2026-05-26.
- [x] Julio authorized push on 2026-05-26.

## Submission evidence placeholders

- Lovable project URL: `https://lovable.dev/projects/7ed0e517-fcb5-47f2-b33f-a3016ba3167b`
- Public demo URL: `Pending Lovable publish`
- Desktop screenshot: `TODO`
- Mobile screenshot: `TODO`
- Demo video/GIF: `TODO`
- Final lint result: `npm run lint` PASS on 2026-05-26; 7 existing shadcn fast-refresh warnings
- Final build result: `npm run build` PASS on 2026-05-26
- Final local e2e result: `npm run test:e2e:local` PASS on 2026-05-26; YouTube, Spotify, share restore, and console checks passed
- Supabase Edge Functions production status: `Not confirmed before Lovable publish; app has local fallback tracklist generation`

## Scope guard

Allowed for this pass:

- `index.html`
- `README.md`
- `.lovable/plan.md`
- Rollback/simplification changes in `src/pages/Index.tsx`, `src/components/ExperienceForm.tsx`, and `src/components/PlaylistResult.tsx`

Do not change for this pass:

- Supabase functions
- package files
- `localPlaylistStore`
- broad layout redesign
- deploy or Lovable sync
