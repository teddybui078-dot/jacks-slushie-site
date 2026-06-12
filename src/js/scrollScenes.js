import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

/* Progress windows for each panel. Gaps between windows give the
   exploding cup solo moments on screen. Only the video scrubs with
   scroll; panels enter/exit with real time-based easings. */
const WINDOWS = [
  { id: 'hero', start: 0, end: 0.1 },
  { id: 'story', start: 0.18, end: 0.38 },
  { id: 'mission', start: 0.44, end: 0.62 },
  { id: 'menu', start: 0.68, end: 0.86 },
  { id: 'location', start: 0.92, end: 1.01 }, // 1.01 so it never exits at the bottom
];

export function initScenes(scrubber) {
  CustomEase.create('quintOut', '0.23, 1, 0.32, 1');

  const panels = WINDOWS.map((w) => {
    const el = document.querySelector(`[data-panel="${w.id}"]`);
    const items = el.querySelectorAll('[data-r]');
    const tl = gsap
      .timeline({ paused: true })
      .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
      .fromTo(
        items,
        { autoAlpha: 0, y: 40, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'quintOut',
          stagger: 0.08,
        },
        0.01
      );
    return { ...w, el, tl, active: false };
  });

  function syncPanels(progress) {
    for (const p of panels) {
      const inWindow = progress >= p.start && progress <= p.end;
      if (inWindow && !p.active) {
        p.active = true;
        p.tl.timeScale(1).play();
      } else if (!inWindow && p.active) {
        p.active = false;
        p.tl.timeScale(2).reverse(); // exits run twice as fast
      }
    }
  }

  const st = ScrollTrigger.create({
    trigger: '#scroll-stage',
    start: 'top top',
    end: 'bottom bottom',
    pin: '#stage-viewport',
    pinSpacing: false,
    invalidateOnRefresh: true,
    onUpdate(self) {
      scrubber.setProgress(self.progress);
      syncPanels(self.progress);
    },
  });

  // apply current state immediately (handles mid-page reloads)
  scrubber.setProgress(st.progress);
  syncPanels(st.progress);

  gsap.fromTo(
    '#site-footer [data-r]',
    { autoAlpha: 0, y: 40, filter: 'blur(8px)' },
    {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'quintOut',
      stagger: 0.08,
      scrollTrigger: { trigger: '#site-footer', start: 'top 80%', once: true },
    }
  );

  return st;
}
