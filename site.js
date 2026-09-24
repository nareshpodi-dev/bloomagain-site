/* Bloom Again — shared behaviour. Loaded with `defer` by every page. */

// Reveal on scroll. Everything is visible without JS -- the class is only
// added once the observer is known to work, so a failure shows the page
// rather than hiding it.
(function () {
  var els = document.querySelectorAll('.rv');
  if (!els.length) return;
  if (!('IntersectionObserver' in window) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  els.forEach(function (el, i) {
    el.style.transitionDelay = Math.min(i % 4, 3) * 60 + 'ms';
    io.observe(el);
  });
})();

// Hairline under the nav only once the page has moved.
(function () {
  var nav = document.querySelector('nav.site');
  if (!nav) return;
  var onScroll = function () { nav.classList.toggle('scrolled', scrollY > 8); };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Quick exit. Standard on sites read by people whose device may be checked:
// leave immediately, and try not to leave this page in session history.
(function () {
  var btn = document.querySelector('.exit');
  if (!btn) return;
  var go = function () { location.replace('https://www.google.com/'); };
  btn.addEventListener('click', go);
  addEventListener('keydown', function (e) { if (e.key === 'Escape') go(); });
})();
