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

// Mobile menu. The panel is plain markup below the bar, so it works with the
// document flow rather than trapping focus in an overlay.
//
// Escape is NOT bound to closing this. Escape is the quick exit, and that has
// to work the instant it is pressed whatever else is on screen -- a menu is
// not worth a delay. The menu closes on the button, on a link, or on a tap
// outside it.
(function () {
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (!btn || !menu) return;
  var set = function (open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    set(!menu.classList.contains('open'));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) set(false);
  });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('open') && !menu.contains(e.target)) set(false);
  });
  // A resize past the breakpoint leaves the panel open but hidden; reset it
  // so the button's state matches what is on screen.
  addEventListener('resize', function () {
    if (innerWidth > 720) set(false);
  });
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
