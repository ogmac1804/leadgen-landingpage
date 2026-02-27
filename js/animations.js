/* ═══════════════════════════════════════════════════════════════
   animations.js – IntersectionObserver + Counter
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.hasAttribute('data-count-to')) {
                        animateCounter(entry.target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
        document.querySelectorAll('[data-count-to]').forEach((el) => observer.observe(el));

        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    });

    function animateCounter(el) {
        const end = parseFloat(el.getAttribute('data-count-to'));
        const suffix = el.getAttribute('data-count-suffix') || '';
        const prefix = el.getAttribute('data-count-prefix') || '';
        const decimals = (end % 1 !== 0) ? 1 : 0;
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * end;
            el.textContent = prefix + current.toFixed(decimals).replace('.', ',') + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }
})();
