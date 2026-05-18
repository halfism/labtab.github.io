/**
 * Main JS - Core interactions
 */
(function () {
  'use strict';

  // ======================
  // Theme Toggle
  // ======================
  const themeBtn = document.getElementById('theme-btn');
  const htmlEl = document.documentElement;

  function sendGiscusTheme(theme) {
    var giscusTheme = theme === 'light' ? 'light' : 'dark_dimmed';
    var iframe = document.querySelector('iframe.giscus-frame');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        giscus: { setConfig: { theme: giscusTheme } }
      }, 'https://giscus.app');
    }
  }

  function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    sendGiscusTheme(theme);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = htmlEl.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // Apply giscus theme when iframe loads
  var giscusObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.tagName === 'IFRAME' && node.classList.contains('giscus-frame')) {
          sendGiscusTheme(htmlEl.getAttribute('data-theme') || 'dark');
        }
      });
    });
  });
  giscusObserver.observe(document.body, { childList: true, subtree: true });

  // ======================
  // Language / i18n Toggle
  // ======================
  var translations = {
    zh: {
      'nav.home': '首页',
      'nav.posts': '博客',
      'nav.categories': '分类',
      'nav.tags': '标签',
      'nav.archive': '归档',
      'nav.about': '关于',
      'nav.search': '搜索',
      'search.placeholder': '搜索文章...',
      'search.empty': '输入关键词开始搜索',
      'search.noresult': '没有找到相关文章',
      'toc.title': '目录',
      'post.related': '相关文章',
      'post.readingTime': '分钟阅读',
      'comments.title': '评论',
      'footer.backToTop': '回到顶部',
      'footer.poweredBy': '由',
      'comments.loading': '正在加载评论...',
      'lang.label': '中',
      'theme.dark': '深色模式',
      'theme.light': '浅色模式'
    },
    en: {
      'nav.home': 'Home',
      'nav.posts': 'Blog',
      'nav.categories': 'Categories',
      'nav.tags': 'Tags',
      'nav.archive': 'Archive',
      'nav.about': 'About',
      'nav.search': 'Search',
      'search.placeholder': 'Search posts...',
      'search.empty': 'Type to start searching',
      'search.noresult': 'No results found',
      'toc.title': 'Contents',
      'post.related': 'Related Posts',
      'post.readingTime': 'min read',
      'comments.title': 'Comments',
      'footer.backToTop': 'Back to Top',
      'footer.poweredBy': 'Powered by',
      'comments.loading': 'Loading comments...',
      'lang.label': 'EN',
      'theme.dark': 'Dark Mode',
      'theme.light': 'Light Mode'
    }
  };

  var langBtn = document.getElementById('lang-btn');
  var langIcon = document.getElementById('lang-icon');
  var savedLang = localStorage.getItem('lang') || 'zh';

  window.__i18n = translations;
  window.__getLang = function () { return localStorage.getItem('lang') || 'zh'; };

  function applyLang(lang) {
    var dict = translations[lang] || translations.zh;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });
    document.querySelectorAll('[data-i18n-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-label');
      if (dict[key]) {
        el.setAttribute('aria-label', dict[key]);
      }
    });
    if (langIcon) {
      langIcon.textContent = dict['lang.label'] || (lang === 'zh' ? '中' : 'EN');
    }
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('lang', lang);
  }

  applyLang(savedLang);

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      var current = localStorage.getItem('lang') || 'zh';
      var next = current === 'zh' ? 'en' : 'zh';
      applyLang(next);
    });
  }

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

  // ======================
  // Image Lightbox
  // ======================
  if (postContent) {
    var lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = '<div class="lightbox__overlay"></div><img class="lightbox__img" src="" alt=""><button class="lightbox__close">&times;</button>';
    document.body.appendChild(lightbox);

    var lightboxImg = lightbox.querySelector('.lightbox__img');
    var lightboxClose = lightbox.querySelector('.lightbox__close');

    function openLightbox(src) {
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    postContent.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('click', function () {
        openLightbox(this.src);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox__overlay').addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

})();
