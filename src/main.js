import './css/tokens.css';
import './css/base.css';
import './css/components.css';
import './css/sections.css';
import './css/stage.css';

import { prefersReducedMotion } from './js/reducedMotion.js';

async function boot() {
  if (prefersReducedMotion()) return;

  const { createVideoScrubber, createCanvasScrubber } = await import('./js/scrubVideo.js');

  const video = document.getElementById('scrub-video');
  const canvas = document.getElementById('scrub-canvas');
  const useCanvas = new URLSearchParams(location.search).get('renderer') === 'canvas';

  let scrubber;
  if (useCanvas) {
    canvas.hidden = false;
    video.hidden = true;
    scrubber = createCanvasScrubber(canvas);
  } else {
    scrubber = createVideoScrubber(video);
  }

  try {
    await scrubber.ready;
  } catch (err) {
    // video unavailable: degrade to the static reduced-motion layout
    console.error(err);
    scrubber.destroy();
    document.documentElement.classList.replace('motion-ok', 'reduced-motion');
    return;
  }

  scrubber.start();

  const { initScenes } = await import('./js/scrollScenes.js');
  initScenes(scrubber);
}

boot();
