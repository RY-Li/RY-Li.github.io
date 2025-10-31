// Script for Responsive Topnav with Dropdown
function responsiveTopnav() {
    var x = document.getElementById("myTopnav");
    var hb = document.getElementById("hamburger");
    if (x.className === "topnav") {
        x.className += " responsive";
        if (hb) hb.setAttribute("aria-expanded", "true");
    } else {
        x.className = "topnav";
        if (hb) hb.setAttribute("aria-expanded", "false");
    }
}


document.addEventListener('DOMContentLoaded', function () {
  var topnav = document.getElementById('myTopnav');
  if (!topnav) return;

  // Delegate clicks inside the topnav
  topnav.addEventListener('click', function (e) {
    const a = e.target.closest('a');
    if (!a) return;

    // Ignore the hamburger/icon link that toggles the menu
    if (a.classList.contains('icon')) return;

    // If this is an in-page anchor (#...), handle navigation ourselves
    const href = a.getAttribute('href') || '';
    const isHash = href.startsWith('#');

    // Close any open dropdown immediately
    const openDD = topnav.querySelector('.dropdown.open');
    if (openDD) {
      openDD.classList.remove('open');
      const content = openDD.querySelector('.dropdown-content');
      if (content) content.style.display = '';
    }

    // If in responsive mode, collapse the menu BEFORE navigating
    if (topnav.classList.contains('responsive')) {
      topnav.className = 'topnav';
    }

    if (isHash) {
      // Prevent the browser's default jump to avoid Safari flash
      e.preventDefault();

      // Prefer scroll into view; your targets have scroll-margin-top in HTML/CSS
      const target = document.querySelector(href);
      if (target && target.scrollIntoView) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Keep the URL hash in sync for back/forward
        history.pushState(null, '', href);
      } else {
        // Fallback: set hash
        location.hash = href;
      }
    }
  });

  // Close dropdowns when their links are tapped/clicked (extra safety)
  topnav.querySelectorAll('.dropdown-content a').forEach(function (link) {
    link.addEventListener('click', function () {
      const dd = link.closest('.dropdown');
      if (dd) {
        dd.classList.remove('open');
        const content = dd.querySelector('.dropdown-content');
        if (content) content.style.display = '';
      }
    }, { passive: true });
  });

  // Touch/click-friendly toggling for dropdown buttons on small screens.
  const dropBtns = topnav.querySelectorAll('.dropdown .dropbtn');
  dropBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      // Only toggle when responsive menu is active (<=600px or class set)
      if (!topnav.classList.contains('responsive') &&
          !window.matchMedia('(max-width:600px)').matches) return;

      e.preventDefault();
      const parent = btn.closest('.dropdown');
      if (!parent) return;
      const isOpen = parent.classList.toggle('open');
      const content = parent.querySelector('.dropdown-content');
      if (content) content.style.display = isOpen ? 'block' : 'none';
    });
  });

  // Safari/iOS fallback: if the hash changes for any reason, ensure menus are closed
  window.addEventListener('hashchange', function () {
    // collapse responsive menu
    if (topnav.classList.contains('responsive')) topnav.className = 'topnav';
    // clear any open dropdowns
    topnav.querySelectorAll('.dropdown.open').forEach(function (dd) {
      dd.classList.remove('open');
      const content = dd.querySelector('.dropdown-content');
      if (content) content.style.display = '';
    });
  });

  // Also guard against orientation changes / resizes
  ['resize', 'orientationchange'].forEach(function (evt) {
    window.addEventListener(evt, function () {
      // Remove inline display styles that might have been set
      topnav.querySelectorAll('.dropdown-content').forEach(function (el) {
        el.style.display = '';
      });
    }, { passive: true });
  });
});