/* ============================================================
   MICHELLINE MABELENG — PORTFOLIO INTERACTIONS
   Hamburger nav · Scroll reveal · Active links · Typewriter
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       HELPERS
       ---------------------------------------------------------- */
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================================
       1. HEADER — add .scrolled once user scrolls past threshold
       ========================================================== */
    const header = $('#siteHeader');

    function updateHeader() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 20);
    }

    /* ==========================================================
       2. HAMBURGER MENU — open, close, backdrop, ESC, focus trap
       ========================================================== */
    const hamburger = $('#hamburger');
    const nav       = $('#primaryNav');
    const backdrop  = $('#navBackdrop');
    const body      = document.body;

    function openMenu() {
        nav?.classList.add('is-open');
        hamburger?.classList.add('is-open');
        backdrop?.classList.add('is-open');
        body.classList.add('nav-open');
        hamburger?.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        nav?.classList.remove('is-open');
        hamburger?.classList.remove('is-open');
        backdrop?.classList.remove('is-open');
        body.classList.remove('nav-open');
        hamburger?.setAttribute('aria-expanded', 'false');
    }

    function toggleMenu() {
        if (nav?.classList.contains('is-open')) closeMenu();
        else openMenu();
    }

    hamburger?.addEventListener('click', toggleMenu);
    backdrop?.addEventListener('click', closeMenu);

    // Close when clicking any nav link (mobile)
    $$('.nav-link, .nav-cta', nav).forEach((link) => {
        link.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 900px)').matches) closeMenu();
        });
    });

    // ESC closes
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Close if resized above the mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeMenu();
    });

    /* ==========================================================
       3. ACTIVE NAV LINK on scroll + show Back-to-top
       ========================================================== */
    const navLinks = $$('.nav-link');
    const sections = $$('section[id]');
    const toTop    = $('#toTop');

    function updateActiveSection() {
        const y = window.scrollY + 140;

        let currentId = sections[0]?.id;
        for (const s of sections) {
            if (s.offsetTop <= y) currentId = s.id;
        }

        navLinks.forEach((link) => {
            link.classList.toggle(
                'is-active',
                link.getAttribute('href') === '#' + currentId
            );
        });
    }

    function updateBackToTop() {
        toTop?.classList.toggle('is-visible', window.scrollY > 520);
    }

    /* Throttled scroll handler */
    let scrollTicking = false;
    function onScroll() {
        if (scrollTicking) return;
        scrollTicking = true;
        window.requestAnimationFrame(() => {
            updateHeader();
            updateActiveSection();
            updateBackToTop();
            scrollTicking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* Smooth scroll to top */
    toTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });

    /* ==========================================================
       4. SCROLL REVEAL — fade in .reveal elements
       ========================================================== */
    function initReveal() {
        const items = $$('.reveal');

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('in'));
            return;
        }

        // Stagger elements that sit side-by-side inside the same grid
        items.forEach((el) => {
            const siblings = Array.from(el.parentElement?.children || [])
                .filter((c) => c.classList.contains('reveal'));
            const index = siblings.indexOf(el);
            el.style.transitionDelay = Math.min(index, 6) * 70 + 'ms';
        });

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
        );

        items.forEach((el) => io.observe(el));
    }

    /* ==========================================================
       5. TYPEWRITER — rotates through role titles in the hero
       ========================================================== */
    const ROLES = [
        'ICT Professional',
        'Electronics Technician',
        'IT Support & Help Desk',
        'Data Capturer',
        'Network Enthusiast',
        'Cybersecurity Learner'
    ];

    function initTypewriter() {
        const el = $('#typewriter');
        if (!el) return;

        if (prefersReducedMotion) {
            el.textContent = ROLES[0];
            return;
        }

        let roleIdx = 0;
        let charIdx = 0;
        let deleting = false;

        function tick() {
            const word = ROLES[roleIdx];
            el.textContent = word.slice(0, charIdx);

            if (!deleting) {
                if (charIdx < word.length) {
                    charIdx++;
                    setTimeout(tick, 85);
                } else {
                    deleting = true;
                    setTimeout(tick, 1700);
                }
            } else {
                if (charIdx > 0) {
                    charIdx--;
                    setTimeout(tick, 40);
                } else {
                    deleting = false;
                    roleIdx = (roleIdx + 1) % ROLES.length;
                    setTimeout(tick, 300);
                }
            }
        }

        tick();
    }

    /* ==========================================================
       6. CONTACT FORM — mailto fallback
       Swap for Formspree/Netlify by setting the form's action+method.
       ========================================================== */
    function initContactForm() {
        const form = $('#contactForm');
        const note = $('#formNote');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = form.name.value.trim();
            const email   = form.email.value.trim();
            const message = form.message.value.trim();

            if (!name || !email || !message) {
                if (note) {
                    note.textContent = 'Please complete all fields before sending.';
                    note.style.color = '#f87171';
                }
                return;
            }

            const subject = encodeURIComponent('Portfolio enquiry from ' + name);
            const body    = encodeURIComponent(message + '\n\n— ' + name + '\n' + email);

            window.location.href =
                `mailto:michelline@mabeleng@gmail.com?subject=${subject}&body=${body}`;

            if (note) {
                note.textContent = 'Opening your email client… Thank you!';
                note.style.color = '#34d399';
            }
            form.reset();
        });
    }

    /* ==========================================================
       7. FOOTER YEAR
       ========================================================== */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ==========================================================
       8. BOOTSTRAP
       ========================================================== */
    function boot() {
        // Initial state
        updateHeader();
        updateActiveSection();
        updateBackToTop();

        // Feature init
        initReveal();
        initTypewriter();
        initContactForm();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    /* ==========================================================
       9. DEBUG LOG
       ========================================================== */
    console.log(
        '%cMichelline Mabeleng · Portfolio',
        'color:#38bdf8;font-weight:700;font-size:13px;',
        '· loaded · v1.0'
    );
})();
