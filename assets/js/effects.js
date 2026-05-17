/**
 * Effects - Visual enhancements
 */
(function () {
  'use strict';

  // ======================
  // Card tilt effect (desktop only)
  // ======================
  if (window.matchMedia('(min-width: 768px)').matches) {
    var cards = document.querySelectorAll('.post-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / 20;
        var rotateY = (centerX - x) / 20;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });

    // ======================
    // Cursor glow on cards
    // ======================
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--glow-x', x + 'px');
        card.style.setProperty('--glow-y', y + 'px');
        card.style.background = 'radial-gradient(circle 150px at ' + x + 'px ' + y + 'px, rgba(108, 99, 255, 0.06), rgba(30, 21, 53, 0.6))';
      });

      card.addEventListener('mouseleave', function () {
        card.style.background = 'rgba(30, 21, 53, 0.6)';
      });
    });
  }

  // ======================
  // Scroll reveal animation
  // ======================
  if ('IntersectionObserver' in window) {
    var sections = document.querySelectorAll('.section, .archive-year, .related-posts');

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    sections.forEach(function (section) {
      section.style.opacity = '0';
      section.style.transform = 'translateY(15px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      revealObserver.observe(section);
    });

    // CSS for revealed state
    var style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
  }

})();
