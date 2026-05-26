# Fryda simple release plan

## Goal

Keep the Lovable app simple and demo-ready under the in-app name **Fryda**.

## Public positioning

- First viewport should use the previous/simple Fryda presentation.
- The main flow is photo upload -> playlist generation -> YouTube/Spotify -> basic share.
- Copy must stay honest: the app generates a local AI-guided tracklist and opens music-service searches/actions. It does not write real playlists into Spotify accounts.

## Current release gates

- [x] First viewport uses the simpler Fryda design.
- [x] User-facing service actions avoid implying Spotify playlist creation.
- [x] Extra contest-polish controls were removed from the primary flow.
- [x] README contains contest evidence placeholders.
- [x] README explicitly discloses Spotify is a search/open action.
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
- Final local e2e result: `npm run test:e2e:local` PASS on 2026-05-26; YouTube, Spotify, share restore, and console checks passed
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
