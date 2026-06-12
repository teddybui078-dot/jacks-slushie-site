import { gsap } from 'gsap';

/* Pointer-driven 3D tilt on flavor cards (max ~3deg) and the floating
   dolphin easter egg. Button squish lives in CSS (:active). */
export function initMicro({ motionOK = true } = {}) {
  if (motionOK) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotationY: dx * 6,
          rotationX: -dy * 6,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
      card.addEventListener('pointerleave', () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.4, ease: 'power2.out' });
      });
    });
  }

  const dolphin = document.getElementById('dolphin');
  if (!dolphin) return;

  if (motionOK) {
    gsap.to(dolphin, { y: -6, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

  dolphin.addEventListener('click', () => {
    if (!motionOK) return;
    gsap.fromTo(
      dolphin.firstElementChild,
      { rotation: -10 },
      { rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.35)' }
    );
  });
}
