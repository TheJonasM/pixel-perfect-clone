<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- UI-only prototype: all content comes from mock data in src/lib/data.ts — no backend logic until requested.
- Leaflet map is lazy-loaded behind ClientOnly — Leaflet touches window and breaks SSR.
- Platform pages wrap in components/AppShell (header, sidebar, mobile bottom nav) — one consistent app chrome.
