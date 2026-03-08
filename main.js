function onDomReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
    return;
  }
  fn();
}

function loadNav() {
  const navContainer = document.getElementById('nav-container');
  if (!navContainer) return;

  const path = navContainer.getAttribute('data-path') || '/nav.html';

  fetch(path)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Nav request failed: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      navContainer.innerHTML = html;
      // Initialize nav toggle after loading
      initNavToggle();
    })
    .catch(err => {
      console.error('Error loading nav:', err);
      // Fallback: inject nav directly if fetch fails
      navContainer.innerHTML = `
        <nav class="nav-bar">
          <a href="/" class="logo">Usmaan Razzaq</a>
          <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-menu" aria-haspopup="true">
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
          </button>
          <ul id="nav-menu" class="nav-menu" data-state="closed">
            <li><a href="/work/">Work</a></li>
            <li><a href="/sandbox/">Sandbox</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/contact/">Contact</a></li>
          </ul>
        </nav>
      `;
      initNavToggle();
    });
}

// Load nav dynamically
onDomReady(loadNav);

// Load footer dynamically
onDomReady(function () {
  const footerContainer = document.getElementById('footer-container');
  if (!footerContainer) return;

  // Determine the correct path to footer.html based on current page depth
  const path = footerContainer.getAttribute('data-path') || '/footer.html';

  fetch(path)
    .then(response => response.text())
    .then(html => {
      footerContainer.innerHTML = html;
    })
    .catch(err => {
      console.error('Error loading footer:', err);
    });
});

// Page loader - fade in effect
window.addEventListener('load', function() {
  // Add loaded class to body to trigger fade-in
  document.body.classList.add('loaded');

  // Remove loader if it exists
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 100);
  }
});

// Navigation toggle functionality - reusable function
function initNavToggle() {
  const logo = document.querySelector('.logo');
  const nav = document.querySelector('.nav-bar');
  const toggle = document.querySelector('.nav-toggle');
  const navMenu = nav ? nav.querySelector('ul') : null;

  // Logo click — use SPA router if available
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.spaRouter) {
        window.spaRouter.navigateTo('/');
      } else {
        window.location.href = '/';
      }
    });
  }

  // Mobile nav toggle
  if (toggle && nav && navMenu) {
    function setNavOpenState(isOpen) {
      nav.classList.toggle('expanded', isOpen);
      nav.setAttribute('data-state', isOpen ? 'open' : 'closed');
      navMenu.setAttribute('data-state', isOpen ? 'open' : 'closed');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    setNavOpenState(false);

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = nav.classList.contains('expanded');
      setNavOpenState(!isExpanded);
    });

    // Close menu when clicking on nav links
    const navLinks = nav.querySelectorAll('ul li a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setNavOpenState(false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        setNavOpenState(false);
      }
    });

    // Escape closes menu for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setNavOpenState(false);
      }
    });

    // Reset mobile nav state on desktop/tablet resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        setNavOpenState(false);
      }
    });
  }
}

// Initialize nav toggle for pages with static nav (fallback)
document.addEventListener('DOMContentLoaded', function() {
  // Only init if nav-container doesn't exist (static nav)
  if (!document.getElementById('nav-container')) {
    initNavToggle();
  }
});

// ===== PAGE INIT HOOKS =====
// These run after SPA content swap to re-initialize page-specific JS



function initWorkDirectory() {
  const workDirectory = document.querySelector('.work-directory');
  const directoryHeader = document.querySelector('.directory-header');
  const workTitles = document.querySelectorAll('.work-title');
  const workEntries = document.querySelectorAll('.work-entry');

  if (workTitles.length === 0 || workEntries.length === 0) return;

  // Mobile/tablet Directory Toggle
  if (directoryHeader && workDirectory) {
    function toggleDirectory(e) {
      e.preventDefault();
      e.stopPropagation();
      workDirectory.classList.toggle('expanded');
      const isExpanded = workDirectory.classList.contains('expanded');
      directoryHeader.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    }

    directoryHeader.addEventListener('click', toggleDirectory);
    directoryHeader.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        toggleDirectory(e);
      }
    });

    document.addEventListener('click', function(e) {
      if (!workDirectory.contains(e.target)) {
        workDirectory.classList.remove('expanded');
        directoryHeader.setAttribute('aria-expanded', 'false');
      }
    });
  }

  let isSwitching = false;

  workTitles.forEach(title => {
    title.addEventListener('click', function(e) {
      e.preventDefault();

      const targetWork = this.getAttribute('data-work');
      const currentActive = document.querySelector('.work-title.active');

      if (currentActive === this || isSwitching) return;

      const currentEntry = document.querySelector('.work-entry.active');
      const targetEntry = document.querySelector(`.work-entry[data-work="${targetWork}"]`);

      workTitles.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      if (currentEntry && targetEntry && currentEntry !== targetEntry) {
        isSwitching = true;

        // Both entries become display:contents — children overlap in same grid cells
        currentEntry.classList.remove('active');
        currentEntry.classList.add('fading-out');

        // Activate new entry — force reflow so the browser registers opacity:0 first
        targetEntry.classList.add('active');
        targetEntry.offsetHeight;

        // After the old entry finishes fading out, remove it from the grid
        setTimeout(() => {
          currentEntry.classList.remove('fading-out');
          isSwitching = false;
        }, 320);
      } else if (targetEntry) {
        workEntries.forEach(entry => entry.classList.remove('active'));
        targetEntry.classList.add('active');
      }

      if (window.innerWidth <= 1120 && workDirectory) {
        setTimeout(() => {
          workDirectory.classList.remove('expanded');
          if (directoryHeader) {
            directoryHeader.setAttribute('aria-expanded', 'false');
          }
        }, 150);
      }
    });
  });
}

function initHomeTabs() {
  // Tabs removed in V5 layout — kept as no-op for compatibility
}

function initDropdowns() {
  const dropdownHeaders = document.querySelectorAll('.dropdown-header');

  dropdownHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      const isActive = this.classList.contains('active');

      dropdownHeaders.forEach(otherHeader => {
        if (otherHeader !== this) {
          const otherTargetId = otherHeader.getAttribute('data-target');
          const otherTargetContent = document.getElementById(otherTargetId);
          otherHeader.classList.remove('active');
          if (otherTargetContent) {
            otherTargetContent.classList.remove('active');
          }
        }
      });

      if (isActive) {
        this.classList.remove('active');
        if (targetContent) {
          targetContent.classList.remove('active');
        }
      } else {
        this.classList.add('active');
        if (targetContent) {
          targetContent.classList.add('active');
        }
      }
    });
  });
}

function initTimestamp() {
  const timeElement = document.getElementById('est-time');
  const availabilityIndicator = document.querySelector('.availability-indicator');
  const availabilityText = document.getElementById('availability-text');

  const isAvailable = true;

  if (availabilityIndicator && availabilityText) {
    if (isAvailable) {
      availabilityIndicator.classList.remove('not-available');
      availabilityText.textContent = 'Available for freelance work';
    } else {
      availabilityIndicator.classList.add('not-available');
      availabilityText.textContent = 'Not available for work';
    }
  }

  let prevTimeString = '';

  function updateESTTime() {
    if (!timeElement) return;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const timeString = formatter.format(now).toLowerCase();

    if (timeString === prevTimeString) return;

    // First render — just set the text with spans
    if (!prevTimeString) {
      timeElement.innerHTML = timeString.split('').map(function(ch) {
        return '<span class="time-char">' + ch + '</span>';
      }).join('');
      prevTimeString = timeString;
      return;
    }

    // Animate changed characters
    var chars = timeElement.querySelectorAll('.time-char');
    var newChars = timeString.split('');

    // Handle length change (e.g. 9:59 → 10:00)
    if (newChars.length !== chars.length) {
      timeElement.innerHTML = newChars.map(function(ch) {
        return '<span class="time-char time-char-in">' + ch + '</span>';
      }).join('');
      prevTimeString = timeString;
      return;
    }

    for (var i = 0; i < newChars.length; i++) {
      if (chars[i] && chars[i].textContent !== newChars[i]) {
        var span = chars[i];
        span.classList.add('time-char-out');
        (function(s, newCh) {
          setTimeout(function() {
            s.textContent = newCh;
            s.classList.remove('time-char-out');
            s.classList.add('time-char-in');
            setTimeout(function() {
              s.classList.remove('time-char-in');
            }, 300);
          }, 150);
        })(span, newChars[i]);
      }
    }

    prevTimeString = timeString;
  }

  updateESTTime();
  setInterval(updateESTTime, 1000);
}

// ===== IMAGE LIGHTBOX =====
function initLightbox() {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;

  const overlayImg = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lightbox-close');

  function open(src, alt) {
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    // Force reflow so the transition plays
    overlay.offsetHeight;
    overlay.classList.add('active');
  }

  function close() {
    overlay.classList.remove('active');
    // Clear src after transition
    setTimeout(() => { overlayImg.src = ''; }, 300);
  }

  // Delegate clicks on .visual-item img
  document.addEventListener('click', function(e) {
    const img = e.target.closest('.visual-item img');
    if (img) {
      e.preventDefault();
      open(img.src, img.alt);
    }
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) close();
  });
}

// Run page-specific init hooks based on current page
function initPageHooks(page) {
  if (page === 'home') {
    initHomeTabs();
    initWorkDirectory();
    initTimestamp();
    initLightbox();
  } else if (page === 'about') {
    initDropdowns();
  }
  // work, sandbox, contact don't need special JS init
}

// ===== SPA ROUTER =====
(function() {
  const spaContent = document.getElementById('spa-content');
  // Only init SPA router on pages that have the SPA shell
  if (!spaContent) return;

  const routes = {
    '/': 'home',
    '/work/': 'work',
    '/about/': 'about',
    '/sandbox/': 'sandbox',
    '/contact/': 'contact'
  };

  const titles = {
    'home': 'Usmaan Razzaq Portfolio',
    'work': 'Work | Usmaan Razzaq',
    'about': 'About | Usmaan Razzaq',
    'sandbox': 'Sandbox | Usmaan Razzaq',
    'contact': 'Contact | Usmaan Razzaq'
  };

  const mainClasses = {
    'home': 'new-homepage',
    'work': '',
    'about': '',
    'sandbox': '',
    'contact': 'contact-page'
  };

  const cache = new Map();
  let isTransitioning = false;

  // Normalize path: ensure trailing slash for SPA routes (except /)
  function normalizePath(path) {
    if (path === '/') return '/';
    return path.endsWith('/') ? path : path + '/';
  }

  // Get page name from path
  function getPage(path) {
    return routes[normalizePath(path)] || null;
  }

  // Fetch a partial and cache it
  function fetchPartial(page) {
    if (cache.has(page)) {
      return Promise.resolve(cache.get(page));
    }
    return fetch('/pages/' + page + '.html')
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to load ' + page);
        return res.text();
      })
      .then(function(html) {
        cache.set(page, html);
        return html;
      });
  }

  // Swap content with fade transition
  function swapContent(page, html) {
    return new Promise(function(resolve) {
      isTransitioning = true;

      // Fade out
      spaContent.classList.add('spa-fade-out');

      setTimeout(function() {
        // Swap HTML
        spaContent.innerHTML = html;

        // Update main element class
        spaContent.className = mainClasses[page] || '';
        spaContent.id = 'spa-content';
        spaContent.setAttribute('data-page', page);

        // Update title
        document.title = titles[page] || 'Usmaan Razzaq Portfolio';

        // Scroll to top
        window.scrollTo(0, 0);

        // Run page init hooks
        initPageHooks(page);

        // Force reflow before fade in
        spaContent.offsetHeight;

        // Fade in (remove the class — CSS transition handles the rest)
        spaContent.classList.remove('spa-fade-out');

        setTimeout(function() {
          isTransitioning = false;
          resolve();
        }, 200);
      }, 200);
    });
  }

  // Navigate to a SPA route
  function navigateTo(path, pushState) {
    if (pushState === undefined) pushState = true;
    if (isTransitioning) return;

    var normalized = normalizePath(path);
    var page = routes[normalized];
    if (!page) return;

    // Don't navigate if already on this page
    if (spaContent.getAttribute('data-page') === page) return;

    if (pushState) {
      history.pushState({ page: page }, '', normalized);
    }

    fetchPartial(page).then(function(html) {
      swapContent(page, html);
    }).catch(function(err) {
      console.error('SPA navigation error:', err);
      // Fallback: full page load
      window.location.href = normalized;
    });
  }

  // Handle browser back/forward
  window.addEventListener('popstate', function(e) {
    var path = window.location.pathname;
    var page = getPage(path);

    if (page) {
      fetchPartial(page).then(function(html) {
        swapContent(page, html);
      }).catch(function() {
        window.location.reload();
      });
    }
  });

  // Intercept clicks on nav links
  document.addEventListener('click', function(e) {
    // Find the closest <a> tag
    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    // Skip external links, mailto, tel, hash-only, target=_blank
    if (link.target === '_blank') return;
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href === '#') return;

    // Check if this is a SPA route
    var page = getPage(href);
    if (page) {
      e.preventDefault();
      navigateTo(href);
    }
  });

  // Expose router globally for logo click handler
  window.spaRouter = { navigateTo: navigateTo };

  // On initial load, detect the current route from URL (for htaccess fallback)
  var initialPage = getPage(window.location.pathname);
  if (initialPage && initialPage !== 'home') {
    // We landed on a SPA route via htaccess — load the correct partial
    fetchPartial(initialPage).then(function(html) {
      spaContent.innerHTML = html;
      spaContent.className = mainClasses[initialPage] || '';
      spaContent.id = 'spa-content';
      spaContent.setAttribute('data-page', initialPage);
      document.title = titles[initialPage] || 'Usmaan Razzaq Portfolio';
      initPageHooks(initialPage);
    }).catch(function() {
      // If partial fetch fails, the home page content stays as fallback
    });
  } else {
    // Home page — init hooks for initial content
    initPageHooks('home');
  }

  // Pre-cache the home partial from current DOM (so going back to home is instant)
  cache.set('home', spaContent.innerHTML);
})();

// ===== Initial page hooks for non-SPA pages =====
// Work Directory - only runs on non-SPA pages (SPA handles this via initPageHooks)
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('spa-content')) return; // SPA handles this
  initWorkDirectory();
});

// Dropdown functionality - only on non-SPA pages
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('spa-content')) return;
  initDropdowns();
});

// EST Timestamp - only on non-SPA pages
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('spa-content')) return;
  initTimestamp();
});
