/**
 * Main JS - Core interactions
 */
(function () {
  'use strict';

  // ======================
  // Header scroll behavior
  // ======================
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ======================
  // Mobile navigation
  // ======================
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMobile.classList.toggle('active');
      document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navMobile.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ======================
  // Reading progress bar
  // ======================
  const progressBar = document.getElementById('reading-progress');

  if (progressBar) {
    function updateProgress() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ======================
  // Table of Contents generation
  // ======================
  const postContent = document.getElementById('post-content');
  const tocList = document.getElementById('toc-list');

  if (postContent && tocList) {
    const headings = postContent.querySelectorAll('h2, h3');

    if (headings.length > 0) {
      headings.forEach(function (heading, index) {
        // Add ID if missing
        if (!heading.id) {
          heading.id = 'heading-' + index;
        }

        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;
        a.setAttribute('data-target', heading.id);

        if (heading.tagName === 'H3') {
          li.classList.add('toc__h3');
        }

        li.appendChild(a);
        tocList.appendChild(li);
      });

      // Highlight current section
      var tocLinks = tocList.querySelectorAll('a');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            tocLinks.forEach(function (link) { link.classList.remove('active'); });
            var activeLink = tocList.querySelector('a[data-target="' + entry.target.id + '"]');
            if (activeLink) activeLink.classList.add('active');
          }
        });
      }, { rootMargin: '-80px 0px -60% 0px' });

      headings.forEach(function (heading) { observer.observe(heading); });
    } else {
      // Hide TOC if no headings
      var toc = document.getElementById('toc');
      if (toc) toc.style.display = 'none';
    }
  }

  // ======================
  // Smooth scroll for anchor links
  // ======================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ======================
  // Fade-in animation on scroll
  // ======================
  var animateElements = document.querySelectorAll('.animate-fade-in-up');

  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(function (el) {
      el.style.animationPlayState = 'paused';
      fadeObserver.observe(el);
    });
  }

})();
