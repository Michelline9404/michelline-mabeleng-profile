/* ============================================================
   MICHELLINE MABELENG — CV INTERACTIONS
   Vanilla JavaScript · html2pdf optional (falls back to print)
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     CONSTANTS
     ---------------------------------------------------------- */
  const THEME_KEY = 'cvTheme';
  const PDF_FILENAME = 'Michelline_Mabeleng_CV.pdf';

  /* ----------------------------------------------------------
     THEME CONTROLLER
     Owns everything related to light/dark mode. Reads and writes
     `body.dark-theme` and persists the choice in localStorage.
     ---------------------------------------------------------- */
  const Theme = {
    current() {
      return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    },

    apply(theme) {
      document.body.classList.toggle('dark-theme', theme === 'dark');
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
      this.updateButton();
    },

    toggle() {
      this.apply(this.current() === 'dark' ? 'light' : 'dark');
    },

    updateButton() {
      const btn = document.querySelector('.btn-toggle-theme');
      if (!btn) return;
      const isDark = this.current() === 'dark';
      btn.textContent = isDark ? '☀️ Light Theme' : '🌙 Dark Theme';
      btn.setAttribute('aria-pressed', String(isDark));
    },

    init() {
      let saved = null;
      try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
      const prefersDark =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

      this.apply(saved || (prefersDark ? 'dark' : 'light'));
    }
  };

  // Expose for the inline `onclick="toggleTheme()"` in the HTML
  window.toggleTheme = () => Theme.toggle();

  /* ----------------------------------------------------------
     PDF DOWNLOAD
     Uses html2pdf when available, otherwise falls back to the
     browser's native print-to-PDF dialog.
     ---------------------------------------------------------- */
  function downloadPdf() {
    const target = document.querySelector('.container');
    if (!target) return;

    if (typeof window.html2pdf !== 'undefined') {
      const wasDark = document.body.classList.contains('dark-theme');
      // Force light theme so the PDF always prints on a white background
      if (wasDark) document.body.classList.remove('dark-theme');

      const options = {
        margin: 10,
        filename: PDF_FILENAME,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
        pagebreak: { mode: ['avoid-all', 'css'] }
      };

      window.html2pdf()
        .set(options)
        .from(target)
        .save()
        .then(() => { if (wasDark) document.body.classList.add('dark-theme'); })
        .catch(() => { if (wasDark) document.body.classList.add('dark-theme'); });
    } else {
      alert(
        'For PDF download, click "OK" then choose "Save as PDF" in the print dialog.'
      );
      window.print();
    }
  }

  /* ----------------------------------------------------------
     SMOOTH SCROLL for internal anchor links
     ---------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ----------------------------------------------------------
     MICRO-INTERACTION for skill chips
     ---------------------------------------------------------- */
  function initSkillChips() {
    document.querySelectorAll('.skill-item').forEach((item) => {
      item.addEventListener('click', () => {
        item.classList.add('is-active');
        window.setTimeout(() => item.classList.remove('is-active'), 220);
      });
    });
  }

  /* ----------------------------------------------------------
     PRINT HOOK — make sure every section is visible before printing
     ---------------------------------------------------------- */
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.section').forEach((s) => {
      s.style.opacity = '1';
      s.style.transform = 'none';
    });
  });

  /* ----------------------------------------------------------
     BOOTSTRAP on DOM ready
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    initSmoothScroll();
    initSkillChips();

    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) downloadBtn.addEventListener('click', downloadPdf);

    console.log(
      '%cMichelline Mabeleng · CV loaded',
      'color:#1CABE2;font-weight:600;',
      '· theme:', Theme.current()
    );
  });
})();
