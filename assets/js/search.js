/**
 * Search - lunr.js client-side search
 */
(function () {
  'use strict';

  var searchBtn = document.getElementById('search-btn');
  var searchOverlay = document.querySelector('.search-overlay');
  var searchInput = document.querySelector('.search-modal__input');
  var searchResults = document.querySelector('.search-modal__results');
  var searchClose = document.querySelector('.search-modal__close');

  if (!searchOverlay || !searchInput) return;

  var searchIndex = null;
  var searchData = null;
  var debounceTimer = null;

  // Open search
  function openSearch() {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    searchInput.focus();
    if (!searchIndex) loadSearchIndex();
  }

  // Close search
  function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  // Load search index
  function loadSearchIndex() {
    var baseUrl = document.querySelector('meta[name="baseurl"]');
    var base = baseUrl ? baseUrl.content : '';
    var jsonUrl = base + '/search.json';

    // Try to determine baseurl from the page
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href && href.indexOf('/assets/css/main.css') > -1) {
        jsonUrl = href.replace('/assets/css/main.css', '/search.json');
        break;
      }
    }

    fetch(jsonUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        searchData = data;
        searchIndex = lunr(function () {
          this.ref('url');
          this.field('title', { boost: 10 });
          this.field('tags', { boost: 5 });
          this.field('categories', { boost: 3 });
          this.field('content');

          data.forEach(function (doc) {
            this.add(doc);
          }, this);
        });
      })
      .catch(function (err) {
        console.warn('Search index load failed:', err);
      });
  }

  function t(key, fallback) {
    var lang = window.__getLang ? window.__getLang() : 'zh';
    var dict = window.__i18n ? (window.__i18n[lang] || window.__i18n.zh) : {};
    return dict[key] || fallback;
  }

  // Perform search
  function performSearch(query) {
    if (!searchIndex || !query.trim()) {
      searchResults.innerHTML = '<div class="search-modal__empty" data-i18n="search.empty">' + t('search.empty', 'Type to start searching') + '</div>';
      return;
    }

    var results;
    try {
      results = searchIndex.search(query + '*');
    } catch (e) {
      results = searchIndex.search(query);
    }

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-modal__empty" data-i18n="search.noresult">' + t('search.noresult', 'No results found') + '</div>';
      return;
    }

    var html = '';
    results.slice(0, 8).forEach(function (result) {
      var item = searchData.find(function (d) { return d.url === result.ref; });
      if (item) {
        html += '<a href="' + item.url + '" class="search-result">';
        html += '<div class="search-result__title">' + escapeHtml(item.title) + '</div>';
        html += '<div class="search-result__excerpt">' + escapeHtml(item.content.substring(0, 120)) + '...</div>';
        html += '<div class="search-result__meta">' + item.date + ' &middot; ' + item.categories + '</div>';
        html += '</a>';
      }
    });

    searchResults.innerHTML = html;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Event listeners
  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // Click outside to close
  searchOverlay.addEventListener('click', function (e) {
    if (e.target === searchOverlay) closeSearch();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // Ctrl+K or Cmd+K to open
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchOverlay.classList.contains('active')) {
        closeSearch();
      } else {
        openSearch();
      }
    }

    // Escape to close
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
  });

  // Search input handler with debounce
  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    var query = this.value;
    debounceTimer = setTimeout(function () {
      performSearch(query);
    }, 200);
  });

})();
