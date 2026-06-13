import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

/* The single continuous video (cup pours -> explodes -> settles) plays as a
   persistent backdrop the whole way down: one scrub mapped to overall page
   scroll, so the cup is always animating behind the floating content. The
   cup is roughly mid-explosion by the menu and settled by the time you reach
   the footer. */

/* the reveal recipe shared by every panel + the footer */
function revealIn(scope) {
  const items = document.querySelectorAll(`${scope} [data-r]`);
  if (!items.length) return;
  gsap.fromTo(
    items,
    { autoAlpha: 0, y: 40, filter: 'blur(8px)' },
    {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'quintOut',
      stagger: 0.08,
      scrollTrigger: { trigger: scope, start: 'top 80%', once: true },
    }
  );
}

export function initScenes(scrubber) {
  CustomEase.create('quintOut', '0.23, 1, 0.32, 1');
  // the mobile URL bar collapsing/expanding changes vh; don't refresh (and
  // jump the scrub) every time it does
  ScrollTrigger.config({ ignoreMobileResize: true });

  // one continuous scrub across the whole stack of content panels
  const st = ScrollTrigger.create({
    trigger: '.scroll-content',
    start: 'top top',
    end: 'bottom bottom',
    invalidateOnRefresh: true,
    onUpdate: (self) => scrubber.setProgress(self.progress),
  });

  // staggered reveals as each panel scrolls into view
  ['[data-panel="hero"]', '[data-panel="problem"]', '[data-panel="mission"]', '[data-panel="menu"]', '[data-panel="find"]', '#site-footer'].forEach(
    revealIn
  );

  // mid-page reload: paint the frame for wherever we landed
  scrubber.setProgress(st.progress);

  return st;
}
