// Script for Responsive Topnav with Dropdown
function responsiveTopnav() {
    const nav = document.getElementById('myTopnav');
    const hb  = document.getElementById('hamburger');
    const open = nav.classList.toggle('responsive');
    if (hb) hb.setAttribute('aria-expanded', String(open));
}


/// Smoothly reset the "Web Version" iframe to top
function resetResumeIframeScroll() {
    const iframe = document.getElementById('resume-web');
    if (!iframe) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const smoothToTop = (win, doc) => {
        if (prefersReduced) {
            // No motion
            win.scrollTo(0, 0);
            doc.documentElement.scrollTop = 0;
            doc.body.scrollTop = 0;
            return;
        }

        // Try native smooth scrolling first
        try {
            // Temporarily ensure smooth behavior via CSS in case the doc doesn’t default to it
            const prev = doc.documentElement.style.scrollBehavior;
            doc.documentElement.style.scrollBehavior = 'smooth';
            win.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

            // Restore any prior inline style after the next frame
            requestAnimationFrame(() => { doc.documentElement.style.scrollBehavior = prev || ''; });
            return;
        } catch (e) {
            // Fall through to JS tween
        }

        // rAF fallback tween (approx. 300ms ease-out)
        const startY = win.scrollY || doc.documentElement.scrollTop || doc.body.scrollTop || 0;
        const duration = 300;
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
        const t0 = performance.now();

        const step = (now) => {
            const t = Math.min(1, (now - t0) / duration);
            const y = Math.round(startY * (1 - easeOutCubic(t)));
            win.scrollTo(0, y);
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    try {
        const win = iframe.contentWindow;
        const doc = iframe.contentDocument || win?.document;

        if (win && doc && (doc.readyState === 'complete' || doc.readyState === 'interactive')) {
            smoothToTop(win, doc);
            return;
        }

        // If not ready yet, scroll after it loads
        const once = () => {
            iframe.removeEventListener('load', once);
            try {
                const w = iframe.contentWindow;
                const d = iframe.contentDocument || w?.document;
                if (w && d) smoothToTop(w, d);
            } catch {}
        };
        iframe.addEventListener('load', once);
    } catch {
        // Cross-origin fallback: reload to reset (not expected for your setup)
        const src = iframe.getAttribute('src');
        if (src) iframe.setAttribute('src', src);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const hb = document.getElementById('hamburger');
    if (hb) hb.addEventListener('click', responsiveTopnav);

    const topnav = document.getElementById('myTopnav');
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

            // If the target is the Web Version iframe, reset its scroll
            if (href === '#resume-web') {
                resetResumeIframeScroll();
            }

            // Smooth scroll into view; your targets have scroll-margin-top in CSS
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const target = document.querySelector(href);
            if (target && target.scrollIntoView) {
                target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
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