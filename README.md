# Jack's Slushies & Snacks

A single-page marketing site for a playful slushie brand. The centerpiece is a scroll-scrubbed video: a kawaii slushie cup that explodes into its ingredients as you scroll, pinned full-viewport with story panels revealing alongside.

Built with Vite, vanilla JS, and GSAP ScrollTrigger. Plain CSS with design tokens, no framework.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the build
```

## Handy debug flags

- `?motion=reduce` — force the reduced-motion experience (static poster, stacked sections)
- `?renderer=canvas` — render the scrub through a canvas instead of the video element

## Asset pipeline

Originals live in the repo root; web derivatives in `public/`. The scrub videos are re-encoded **all-intra** (every frame a keyframe) so they seek smoothly, and keep the source's **portrait** aspect (≈3:4 — `scale=-2` preserves it). Current source: `jacks-videov2.mp4`. To regenerate:

```bash
# scrub videos (all-intra, portrait preserved)
ffmpeg -y -i jacks-videov2.mp4 -vf "scale=-2:1080:flags=lanczos" -c:v libx264 -profile:v high \
  -pix_fmt yuv420p -x264-params "keyint=1:min-keyint=1:scenecut=0" -crf 23 -preset medium \
  -an -movflags +faststart public/video/jacks-scrub-1080.mp4
ffmpeg -y -i jacks-videov2.mp4 -vf "scale=-2:720:flags=lanczos" -c:v libx264 -profile:v high \
  -pix_fmt yuv420p -x264-params "keyint=1:min-keyint=1:scenecut=0" -crf 24 -preset medium \
  -an -movflags +faststart public/video/jacks-scrub-720.mp4

# stills — poster (first frame), endframe (last), loader (small). This ffmpeg
# build has no libwebp, so go through PNG then cwebp.
ffmpeg -y -ss 0   -i jacks-videov2.mp4 -frames:v 1 -vf "scale=-2:1080:flags=lanczos" /tmp/poster.png
ffmpeg -y -ss 9.9 -i jacks-videov2.mp4 -frames:v 1 -vf "scale=-2:1080:flags=lanczos" /tmp/endframe.png
ffmpeg -y -ss 0   -i jacks-videov2.mp4 -frames:v 1 -vf "scale=-2:300:flags=lanczos"  /tmp/loader.png
cwebp -q 82 /tmp/poster.png   -o public/img/jacks-poster.webp
cwebp -q 82 /tmp/endframe.png -o public/img/jacks-endframe.webp
cwebp -q 80 /tmp/loader.png   -o public/img/jacks-loader.webp

# logo / dolphin / favicon come from the logo image (unchanged; need libwebp or cwebp)
ffmpeg -i jacks-slushies-logo.jpg -vf "scale=512:512" -c:v libwebp -quality 85 public/img/jacks-logo.webp
ffmpeg -i jacks-slushies-logo.jpg -vf "crop=iw*0.60:ih*0.60:(iw-ow)/2:(ih-oh)/2,scale=240:240" -c:v libwebp -quality 85 public/img/jacks-dolphin.webp
ffmpeg -i jacks-slushies-logo.jpg -vf "crop=iw*0.60:ih*0.60:(iw-ow)/2:(ih-oh)/2,scale=64:64" public/favicon.png
```
