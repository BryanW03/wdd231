// scroll.js – Header shrink + section reveal animations (ES Module)
 
export function initScroll() {
  const header = document.querySelector('header');
 
  // ── Header shrink on scroll ──
  function onScroll() {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }
 
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page starts scrolled
 
  // ── Intersection Observer for reveal animations ──
  const revealEls = document.querySelectorAll('.section, .page-hero, .recap-bar, .hero');
 
  if (!revealEls.length) return;
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal', 'visible');
        // Also stagger direct children for grids
        entry.target.classList.add('reveal-stagger');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
 
  revealEls.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}
 