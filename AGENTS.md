# Jack's Slushies & Snacks — agent notes

Single-page marketing site. Stack: **Vite + vanilla JS + GSAP (ScrollTrigger)**. No React, no Tailwind — plain CSS with design tokens in `src/css/tokens.css`.

## Commands

```bash
npm run dev       # dev server (default http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # serve dist/
```

npm gotcha: the user's `~/.npm` cache is damaged. Prefix every npm command with:

```bash
export npm_config_cache=/tmp/npm-cache-JacksSlushie-Site
```

## Architecture

- `#scroll-stage` is a 500vh scroll container; `#stage-viewport` is pinned full-viewport by GSAP ScrollTrigger; scroll progress scrubs `video.currentTime` via an rAF lerp loop in `src/js/scrubVideo.js`.
- Content panels are threshold-triggered (not scrub-tied) at progress windows in `src/js/scrollScenes.js`.
- Reduced motion (`prefers-reduced-motion` or `?motion=reduce`): static poster, stacked sections, zero video bytes downloaded.
- Canvas renderer fallback: `?renderer=canvas`.

## Asset pipeline

Source files in repo root (`jacks-video.mp4`, `jacks-startframe.png`, `jacks-endframe.png`, `jacks-slushies-logo.jpg`) are originals — never overwrite. Web derivatives live in `public/video/` and `public/img/`. The scrub videos MUST be all-intra (`keyint=1`); the source mp4 has a single keyframe and cannot be scrubbed directly. Regeneration commands are in `README.md`.
