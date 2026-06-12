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

Originals live in the repo root; web derivatives in `public/`. The scrub videos are re-encoded **all-intra** (every frame a keyframe) because the source mp4 has a single keyframe and cannot be seeked smoothly. To regenerate:

```bash
# scrub videos
ffmpeg -i jacks-video.mp4 -vf "scale=1080:1080:flags=lanczos" -c:v libx264 -profile:v high \
  -pix_fmt yuv420p -x264-params "keyint=1:min-keyint=1:scenecut=0" -crf 23 -preset slow \
  -an -movflags +faststart public/video/jacks-scrub-1080.mp4
ffmpeg -i jacks-video.mp4 -vf "scale=720:720:flags=lanczos" -c:v libx264 -profile:v high \
  -pix_fmt yuv420p -x264-params "keyint=1:min-keyint=1:scenecut=0" -crf 24 -preset slow \
  -an -movflags +faststart public/video/jacks-scrub-720.mp4

# images
ffmpeg -i jacks-startframe.png -vf "scale=1080:1080:flags=lanczos" -c:v libwebp -quality 82 public/img/jacks-poster.webp
ffmpeg -i jacks-endframe.png  -vf "scale=1080:1080:flags=lanczos" -c:v libwebp -quality 82 public/img/jacks-endframe.webp
ffmpeg -i jacks-startframe.png -vf "scale=360:360:flags=lanczos" -c:v libwebp -quality 80 public/img/jacks-loader.webp
ffmpeg -i jacks-slushies-logo.jpg -vf "scale=512:512" -c:v libwebp -quality 85 public/img/jacks-logo.webp
ffmpeg -i jacks-slushies-logo.jpg -vf "crop=iw*0.60:ih*0.60:(iw-ow)/2:(ih-oh)/2,scale=240:240" -c:v libwebp -quality 85 public/img/jacks-dolphin.webp
ffmpeg -i jacks-slushies-logo.jpg -vf "crop=iw*0.60:ih*0.60:(iw-ow)/2:(ih-oh)/2,scale=64:64" public/favicon.png
```
