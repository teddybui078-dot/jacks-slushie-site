/* The actual check runs in an inline <head> script so the class lands
   before first paint; this just reads the result. `?motion=reduce`
   forces it for testing. */
export function prefersReducedMotion() {
  return document.documentElement.classList.contains('reduced-motion');
}
