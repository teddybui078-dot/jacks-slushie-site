import './css/tokens.css';
import './css/base.css';
import './css/components.css';
import './css/sections.css';
import './css/stage.css';
import './css/loader.css';

import { prefersReducedMotion } from './js/reducedMotion.js';

async function boot() {
  if (prefersReducedMotion()) {
    const { initMicro } = await import('./js/microinteractions.js');
    initMicro({ motionOK: false });
    return;
  }

  const { initLoader } = await import('./js/loader.js');
  const loader = initLoader();

  const { createVideoScrubber, createCanvasScrubber } = await import('./js/scrubVideo.js');

  const video = document.getElementById('scrub-video');
  const canvas = document.getElementById('scrub-canvas');
  const useCanvas = new URLSearchParams(location.search).get('renderer') === 'canvas';

  let scrubber;
  if (useCanvas) {
    canvas.hidden = false;
    video.hidden = true;
    scrubber = createCanvasScrubber(canvas, { onProgress: loader.setProgress });
  } else {
    scrubber = createVideoScrubber(video, { onProgress: loader.setProgress });
  }

  try {
    await scrubber.ready;
  } catch (err) {
    // video unavailable: degrade to the static reduced-motion layout
    console.error(err);
    scrubber.destroy();
    document.documentElement.classList.replace('motion-ok', 'reduced-motion');
    loader.dismiss();
    return;
  }

  scrubber.start();

  const { initScenes } = await import('./js/scrollScenes.js');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  initScenes(scrubber);
  // the two beat pins measure spacers against the freshly built layout;
  // recompute now that video metadata + sections are settled, and again
  // once webfonts land in case heading reflow shifts section heights
  ScrollTrigger.refresh();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  loader.dismiss();

  const { initMicro } = await import('./js/microinteractions.js');
  initMicro({ motionOK: true });
}

boot();
