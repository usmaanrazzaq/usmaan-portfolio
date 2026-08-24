function onDomReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
    return;
  }
  fn();
}

// Vercel Web Analytics (`@vercel/analytics`). There is no bundler, so this
// mirrors inject(): load /_vercel/insights/script.js and queue events.
function injectVercelAnalytics() {
  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };

  var src = '/_vercel/insights/script.js';
  if (document.querySelector('script[src*="' + src + '"]')) return;

  var script = document.createElement('script');
  script.defer = true;
  script.src = src;
  script.dataset.sdkn = '@vercel/analytics';
  script.dataset.sdkv = '2.0.1';
  script.onerror = function () {
    var host = location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return;
    console.log('[Vercel Web Analytics] Failed to load. Enable Web Analytics in the Vercel dashboard and redeploy. https://vercel.com/docs/analytics/quickstart');
  };
  document.head.appendChild(script);
}

function trackVercelPageview() {
  if (typeof window.va !== 'function') return;
  window.va('pageview', {
    path: window.location.pathname,
    route: window.location.pathname
  });
}

injectVercelAnalytics();

document.body.classList.toggle('home-route', window.location.pathname === '/');
document.body.classList.toggle(
  'playground-route',
  window.location.pathname === '/playground/' || window.location.pathname === '/playground'
);
document.body.classList.toggle(
  'about-route',
  window.location.pathname === '/about/' || window.location.pathname === '/about'
);

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
            <li><a href="/playground/">Playground</a></li>
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

// Page loader - fade in as soon as the DOM is ready (do not wait for window "load":
// large videos and images would keep the UI hidden for a long time on slow networks).
function finishPageLoadTransition() {
  document.body.classList.add('loaded');
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(function() {
      loader.classList.add('hidden');
    }, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', finishPageLoadTransition, { once: true });
} else {
  finishPageLoadTransition();
}

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

// ===== GSAP DEFAULTS =====
if (typeof gsap !== 'undefined') {
  gsap.defaults({ duration: 0.3, ease: "expo.out" });
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
}

// ===== HOVER EFFECTS (GSAP) =====
function initHoverEffects(page) {
  if (typeof gsap === 'undefined') return;

  // Only run on pointer devices that support hover
  var mm = gsap.matchMedia();

  mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", function() {

    if (page === 'playground') {
      gsap.from('.paper-projects__item', {
        y: 16,
        opacity: 0,
        duration: 0.55,
        ease: 'expo.out',
        clearProps: 'all'
      });
    }

    // Return cleanup function
    return function() {
      // matchMedia handles cleanup automatically
    };
  });
}

// ===== PAGE INIT HOOKS =====
// These run after SPA content swap to re-initialize page-specific JS



// Lazy-load videos: swap data-src → src and autoplay when entry becomes active
function activateEntryMedia(entry) {
  if (!entry) return;
  entry.querySelectorAll('video[data-src]').forEach(function(video) {
    video.src = video.getAttribute('data-src');
    video.removeAttribute('data-src');
    video.autoplay = true;
    video.play().catch(function() {});
  });
}

// Pause and unload videos when entry is no longer active
function deactivateEntryMedia(entry) {
  if (!entry) return;
  entry.querySelectorAll('video').forEach(function(video) {
    if (video.src) {
      video.pause();
      video.setAttribute('data-src', video.src);
      video.removeAttribute('src');
      video.load();
    }
  });
}

// ===== CASE-STUDY VISUAL SCROLL REVEALS =====
// Restrained rise-in for .cs-visual blocks as they scroll into view. Motion is
// reserved for the work itself — text/hero stay stable. Visuals already in view
// on load/switch are shown immediately so nothing flashes.
var csRevealObserver = null;

function initCaseStudyReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  csRevealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.remove('cs-reveal-hidden');
        csRevealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.04 });

  setupCaseStudyReveals(document.querySelector('.work-entry.active'));
}

function setupCaseStudyReveals(scope) {
  if (!scope || !csRevealObserver) return;
  var vh = window.innerHeight || document.documentElement.clientHeight;
  var visuals = scope.querySelectorAll(':scope > .cs-visual');
  visuals.forEach(function(v) {
    var rect = v.getBoundingClientRect();
    // Already in (or near) view on entry — reveal immediately, no animation.
    if (rect.top < vh * 0.9) {
      v.classList.remove('cs-reveal-hidden');
      csRevealObserver.unobserve(v);
    } else {
      v.classList.add('cs-reveal-hidden');
      csRevealObserver.observe(v);
    }
  });
}

// One debounced refresh after work switches — avoids double ScrollTrigger
// recalculation (rAF + timeout) that caused visible jitter / scroll snap.
var workSwitchScrollRefreshTimer = null;
function scheduleWorkScrollRefreshAfterSwitch() {
  if (typeof ScrollTrigger === 'undefined') return;
  if (workSwitchScrollRefreshTimer) clearTimeout(workSwitchScrollRefreshTimer);
  workSwitchScrollRefreshTimer = setTimeout(function() {
    workSwitchScrollRefreshTimer = null;
    ScrollTrigger.refresh();
    if (typeof initChartScrollTriggers === 'function') initChartScrollTriggers();
    if (typeof initGlobeReachScrollTriggers === 'function') initGlobeReachScrollTriggers();
    if (typeof initPainPointCharts === 'function') initPainPointCharts();
  }, 400);
}

function getWorkEntryHeight(entry) {
  if (!entry) return 0;

  const wasActive = entry.classList.contains('active');
  const wasMeasuring = entry.classList.contains('measuring');

  if (!wasActive) entry.classList.add('measuring');
  const height = entry.offsetHeight;
  if (!wasActive && !wasMeasuring) entry.classList.remove('measuring');

  return height;
}

function initWorkDirectory() {
  const workDirectory = document.querySelector('.work-directory');
  const directoryHeader = document.querySelector('.directory-header');
  const workSection = document.querySelector('.work-section');
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
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      workTitles.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      if (currentEntry && targetEntry && currentEntry !== targetEntry && !prefersReduced) {
        isSwitching = true;

        // Phase 0 — capture heights before any class change. Delta math keeps the
        // section's padding constant across the responsive breakpoints.
        var startHeight = workSection ? workSection.offsetHeight : 0;
        var endHeight = startHeight
          - getWorkEntryHeight(currentEntry)
          + getWorkEntryHeight(targetEntry);

        if (workSection) {
          workSection.style.height = `${startHeight}px`;
          workSection.classList.add('is-switching');
        }

        // Phase 1 — fade the current entry out (stays in normal flow).
        currentEntry.classList.remove('active');
        currentEntry.classList.add('is-leaving');

        setTimeout(() => {
          // Phase 2 — current entry is fully out; bring the target entry in.
          currentEntry.classList.remove('is-leaving');
          deactivateEntryMedia(currentEntry);

          targetEntry.classList.add('active', 'entering');
          activateEntryMedia(targetEntry);
          var carousel = targetEntry.querySelector('[data-carousel]');
          if (carousel && carousel._carouselGoTo) carousel._carouselGoTo(0, true);
          targetEntry.offsetHeight;

          // Ease the section height to the target alongside the fade-in.
          if (workSection) workSection.style.height = `${endHeight}px`;

          requestAnimationFrame(() => {
            targetEntry.classList.remove('entering');
          });

          // Phase 3 — cleanup once the fade-in + height transition settle.
          setTimeout(() => {
            if (workSection) {
              workSection.classList.remove('is-switching');
              workSection.style.height = '';
            }
            scheduleWorkScrollRefreshAfterSwitch();
            setupCaseStudyReveals(targetEntry);
            if (targetWork === 'otrs' && typeof tryInitGlobeInEntry === 'function') {
              setTimeout(function() { tryInitGlobeInEntry(targetEntry); }, 450);
            }
            isSwitching = false;
          }, 300);
        }, 200);

      } else if (targetEntry) {
        workEntries.forEach(entry => {
          entry.classList.remove('active');
          deactivateEntryMedia(entry);
        });
        targetEntry.classList.add('active');
        activateEntryMedia(targetEntry);
        scheduleWorkScrollRefreshAfterSwitch();
        setupCaseStudyReveals(targetEntry);
        if (targetWork === 'otrs' && typeof tryInitGlobeInEntry === 'function') {
          setTimeout(function() { tryInitGlobeInEntry(targetEntry); }, 450);
        }
        var carousel2 = targetEntry.querySelector('[data-carousel]');
        if (carousel2 && carousel2._carouselGoTo) carousel2._carouselGoTo(0, true);
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
  // Availability indicator removed in v6 layout — no-op
}

// ===== LOCAL TIME + LIVING STATUS MODULE =====
// SPA-safe: initLocalTime runs on every home init, so clear any prior interval
// before starting a new one — otherwise intervals stack and the pulse multi-fires.
var _localTimeInterval = null;

var _homeCaseObserver = null;
var _homeNavAbort = null;

function getPreferredTheme() {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') return attr;
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch (e) {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncBrowserChrome(theme) {
  var color = theme === 'dark' ? '#111111' : '#ffffff';
  document.documentElement.style.backgroundColor = color;

  // Keep Safari/iOS status + toolbar chrome in sync with site theme
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', color);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  syncBrowserChrome(theme);
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {}

  document.querySelectorAll('.paper-home__theme').forEach(function(btn) {
    const isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

// SPA-safe: bind once via delegation. Per-button data-theme-bound markers were
// serialized into the home HTML cache, so returning to a cached page skipped
// rebinding and left the toggle dead (new DOM nodes, no listeners).
var _themeToggleBound = false;

function initThemeToggle() {
  applyTheme(getPreferredTheme());

  if (_themeToggleBound) return;
  _themeToggleBound = true;

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.paper-home__theme');
    if (!btn) return;
    applyTheme(getPreferredTheme() === 'dark' ? 'light' : 'dark');
  });
}

function initHomeNavMenu() {
  const nav = document.querySelector('.paper-home__nav');
  const toggle = document.querySelector('.paper-home__nav-toggle');
  const label = document.querySelector('.paper-home__nav-toggle-label');
  const menu = document.querySelector('.paper-home__tabs');
  if (!nav || !toggle || !menu) return;

  if (_homeNavAbort) {
    _homeNavAbort.abort();
    _homeNavAbort = null;
  }
  _homeNavAbort = new AbortController();
  const signal = _homeNavAbort.signal;

  const active = menu.querySelector('.is-active, [aria-current="page"]');
  if (label && active) {
    label.textContent = active.textContent.trim();
  }

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  setOpen(false);

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    setOpen(!nav.classList.contains('is-open'));
  }, { signal: signal });

  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target)) setOpen(false);
  }, { signal: signal });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') setOpen(false);
  }, { signal: signal });

  menu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      setOpen(false);
    }, { signal: signal });
  });
}

function initHomeStack() {
  const cases = document.querySelectorAll('.paper-home__stack .paper-home__case');
  if (!cases.length) return;

  if (_homeCaseObserver) {
    _homeCaseObserver.disconnect();
    _homeCaseObserver = null;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || typeof IntersectionObserver === 'undefined') {
    cases.forEach(function(el) {
      el.classList.add('is-visible');
    });
    return;
  }

  _homeCaseObserver = new IntersectionObserver(
    function(entries, observer) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  cases.forEach(function(el) {
    _homeCaseObserver.observe(el);
  });
}

function initLocalTime() {
  const el = document.getElementById('local-time');
  if (!el) return;

  const live = document.querySelector('.hero-live');
  const dayNight = document.querySelector('.hero-daynight');

  let prev = '';

  function update() {
    const now = new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    if (now === prev) return;

    const chars = now.split('');
    const prevChars = prev.split('');

    el.innerHTML = chars.map(function(ch, i) {
      const changed = prevChars[i] !== ch && prev !== '';
      return '<span class="time-digit' + (changed ? ' changing' : '') + '">' + ch + '</span>';
    }).join('');

    prev = now;

    // Day/night glyph — reflect the current New York hour (24h).
    if (dayNight) {
      const h = parseInt(new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hour12: false,
      }), 10);
      const isDay = h >= 7 && h < 19;
      dayNight.classList.toggle('is-day', isDay);
      dayNight.classList.toggle('is-night', !isDay);
    }

    // Live pulse — restart the beat in sync with the tick (reflow trick).
    if (live) {
      live.classList.remove('is-beating');
      void live.offsetWidth;
      live.classList.add('is-beating');
    }
  }

  update();
  clearInterval(_localTimeInterval);
  _localTimeInterval = setInterval(update, 1000);
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

  // Make lightbox images keyboard-accessible
  document.querySelectorAll('.visual-item img').forEach(function(img) {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', (img.alt || 'Image') + ' — click to enlarge');
  });

  // Delegate clicks on .visual-item img
  document.addEventListener('click', function(e) {
    const img = e.target.closest('.visual-item img');
    if (img) {
      e.preventDefault();
      open(img.src, img.alt);
    }
  });

  // Keyboard support for lightbox images
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const img = e.target.closest('.visual-item img');
      if (img) {
        e.preventDefault();
        open(img.src, img.alt);
      }
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


// ===== CAROUSEL =====
function initCarousels() {
  var carousels = document.querySelectorAll('[data-carousel]:not([data-single])');
  if (!carousels.length || typeof gsap === 'undefined') return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  carousels.forEach(function(container) {
    var track = container.querySelector('.carousel-track');
    var slides = container.querySelectorAll('.carousel-slide');
    var dotsContainer = container.querySelector('.carousel-dots');
    if (!track || slides.length < 2) return;

    var currentIndex = 0;
    var slideCount = slides.length;

    // ARIA
    container.setAttribute('role', 'region');
    container.setAttribute('aria-roledescription', 'carousel');
    container.setAttribute('tabindex', '0');

    // Arrow SVG (simple chevron)
    var arrowSVG = '<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 2.5L9.5 7L5 11.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    // Prev/Next arrows overlaid on the carousel
    var prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-arrow carousel-arrow--prev';
    prevBtn.setAttribute('type', 'button');
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.innerHTML = arrowSVG;
    prevBtn.disabled = true;

    var nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-arrow carousel-arrow--next';
    nextBtn.setAttribute('type', 'button');
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.innerHTML = arrowSVG;

    container.appendChild(prevBtn);
    container.appendChild(nextBtn);

    // Build dots below the carousel
    for (var i = 0; i < slideCount; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('type', 'button');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.setAttribute('data-index', i);
      dotsContainer.appendChild(dot);
    }

    var dots = dotsContainer.querySelectorAll('.carousel-dot');

    function getSlideWidth() {
      return slides[0].offsetWidth + 14; // matches CSS gap
    }

    function goTo(index, instant) {
      if (index < 0) index = 0;
      if (index >= slideCount) index = slideCount - 1;
      currentIndex = index;

      var offset = -index * getSlideWidth();

      if (prefersReducedMotion || instant) {
        gsap.set(track, { x: offset });
      } else {
        gsap.to(track, { x: offset, duration: 0.6, ease: 'expo.out' });
      }

      // Update dots
      dots.forEach(function(d, di) {
        d.classList.toggle('active', di === currentIndex);
      });

      // Update arrows
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slideCount - 1;

      // Trigger chart animation if this slide has one
      var activeSlide = slides[currentIndex];
      if (activeSlide) {
        var chart = activeSlide.querySelector('.chart-card');
        if (chart && !chart.classList.contains('chart-animated')) {
          initChartAnimation(chart);
        }
      }
    }

    // Arrow clicks
    prevBtn.addEventListener('click', function() { goTo(currentIndex - 1); });
    nextBtn.addEventListener('click', function() { goTo(currentIndex + 1); });

    // Dot clicks
    dotsContainer.addEventListener('click', function(e) {
      var dot = e.target.closest('.carousel-dot');
      if (!dot) return;
      var idx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(idx)) goTo(idx);
    });

    // Keyboard navigation
    container.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(currentIndex + 1);
      }
    });

    // Drag / swipe via pointer events
    var dragStartX = 0;
    var dragCurrentX = 0;
    var isDragging = false;
    var trackStartX = 0;
    var threshold = 0.2; // 20% of slide width

    function onPointerDown(e) {
      // Don't interfere with clicks on links/buttons
      if (e.target.closest('a, button')) {
        // Still track for swipe detection
      }
      isDragging = true;
      dragStartX = e.clientX;
      dragCurrentX = e.clientX;
      trackStartX = gsap.getProperty(track, 'x') || 0;
      container.classList.add('is-dragging');
      track.style.userSelect = 'none';
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      dragCurrentX = e.clientX;
      var dx = dragCurrentX - dragStartX;
      gsap.set(track, { x: trackStartX + dx });
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove('is-dragging');
      track.style.userSelect = '';

      var dx = dragCurrentX - dragStartX;
      var slideW = getSlideWidth();
      var thresholdPx = slideW * threshold;

      if (Math.abs(dx) > thresholdPx) {
        if (dx < 0) {
          goTo(currentIndex + 1);
        } else {
          goTo(currentIndex - 1);
        }
      } else {
        // Snap back
        goTo(currentIndex);
      }
    }

    track.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Prevent native drag on images/videos
    track.addEventListener('dragstart', function(e) { e.preventDefault(); });

    // Recalculate on resize
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        goTo(currentIndex, true);
      }, 100);
    });

    // Expose for external reset
    container._carouselGoTo = goTo;
  });
}

// ===== CHART ANIMATION =====
function initChartAnimation(chart) {
  var lines = chart.querySelectorAll('.chart-line');
  if (!lines.length) return;

  // Measure each polyline length and set the CSS variable
  lines.forEach(function(line) {
    var length = 0;
    try {
      length = line.getTotalLength();
    } catch (e) {
      length = parseFloat(line.style.getPropertyValue('--chart-length')) || 1000;
    }
    line.style.setProperty('--chart-length', length);
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
  });

  // Force reflow so the browser registers the initial state
  chart.offsetHeight;

  // Add animated class to trigger CSS transitions
  chart.classList.add('chart-animated');
}

// ===== PRODUCT DESIGNER CARET + SELECTION ANIMATION =====
// ===== HOMEPAGE SCROLL ANIMATIONS =====
function initHomeScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function() {

    // Hero entrance — fade-in + slide-up
    var heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      gsap.set(heroContent, { opacity: 0, y: 20 });
      gsap.to(heroContent, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'expo.out',
        delay: 0.15,
        onComplete: function() {
          gsap.set(heroContent, { clearProps: 'transform' });
        }
      });
    }

    // Work section scroll reveal
    var workSection = document.querySelector('.work-section');
    if (workSection) {
      var workDirectoryEl = workSection.querySelector('.work-directory');

      if (workDirectoryEl) gsap.set(workDirectoryEl, { opacity: 0, x: -20 });

      ScrollTrigger.create({
        trigger: workSection,
        start: 'top 85%',
        once: true,
        onEnter: function() {
          if (workDirectoryEl) {
            gsap.to(workDirectoryEl, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' });
          }
        }
      });
    }

    // Cleanup on SPA page swap
    return function() {
      ScrollTrigger.getAll().forEach(function(t) { t.kill(); });
    };
  });
}

// ===== SCROLL-DOWN HINT =====
function initScrollHint() {
  var btn = document.querySelector('.hero-scroll-cue');
  if (!btn) return;

  var workSection = document.querySelector('.work-section');
  var heroIntro = document.querySelector('.hero-intro');
  var topBlur = document.querySelector('.top-blur');
  var bottomBlur = document.querySelector('.bottom-blur');

  btn.addEventListener('click', function() {
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  var cueHidden = false;
  var topBlurOn = false;
  var bottomBlurOn = false;
  function onScroll() {
    var heroHeight = heroIntro ? heroIntro.offsetHeight : window.innerHeight;
    var pastHero = window.scrollY > heroHeight * 0.45;
    if (pastHero !== cueHidden) {
      cueHidden = pastHero;
      btn.classList.toggle('hidden', cueHidden);
    }
    // Bottom bleed only once past the hero — otherwise it washes out the scroll cue.
    if (bottomBlur && pastHero !== bottomBlurOn) {
      bottomBlurOn = pastHero;
      bottomBlur.classList.toggle('is-visible', bottomBlurOn);
    }
    // Top bleed only once content is actually scrolling under the nav —
    // otherwise it blurs the hero timestamp at rest.
    var shouldTopBlur = window.scrollY > 24;
    if (topBlur && shouldTopBlur !== topBlurOn) {
      topBlurOn = shouldTopBlur;
      topBlur.classList.toggle('is-visible', topBlurOn);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Inspiration links — floating source-preview card that follows the cursor
function initInspirationPreview() {
  var links = document.querySelectorAll('.inspiration-link[data-preview-domain]');
  if (!links.length) return;

  // Pointer-driven enhancement only — leave touch/coarse pointers untouched
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reuse the shared card across SPA navigations so it never stacks
  var card = document.getElementById('inspiration-preview-card');
  if (!card) {
    card = document.createElement('div');
    card.id = 'inspiration-preview-card';
    card.className = 'inspiration-preview';
    card.setAttribute('aria-hidden', 'true');
    card.innerHTML =
      '<div class="inspiration-preview-source">' +
        '<img class="inspiration-preview-favicon" alt="" width="16" height="16">' +
        '<span class="inspiration-preview-domain"></span>' +
      '</div>' +
      '<span class="inspiration-preview-title"></span>';
    document.body.appendChild(card);
  }

  var faviconEl = card.querySelector('.inspiration-preview-favicon');
  var domainEl = card.querySelector('.inspiration-preview-domain');
  var titleEl = card.querySelector('.inspiration-preview-title');
  faviconEl.onerror = function() { faviconEl.style.display = 'none'; };

  var OFFSET = 18;
  var EDGE = 12;
  var targetX = 0, targetY = 0, curX = 0, curY = 0;
  var rafId = null;
  var tracking = false;

  function place(x, y) {
    var w = card.offsetWidth || 220;
    var h = card.offsetHeight || 80;
    var px = x + OFFSET;
    var py = y + OFFSET;
    if (px + w + EDGE > window.innerWidth) px = x - w - OFFSET;
    if (py + h + EDGE > window.innerHeight) py = y - h - OFFSET;
    card.style.left = Math.max(EDGE, px) + 'px';
    card.style.top = Math.max(EDGE, py) + 'px';
  }

  function loop() {
    curX += (targetX - curX) * 0.18;
    curY += (targetY - curY) * 0.18;
    place(curX, curY);
    rafId = tracking ? requestAnimationFrame(loop) : null;
  }

  function showCard(link) {
    var domain = link.getAttribute('data-preview-domain');
    domainEl.textContent = domain;
    titleEl.textContent = link.textContent.trim();
    faviconEl.style.display = '';
    faviconEl.src = 'https://www.google.com/s2/favicons?domain=' +
      encodeURIComponent(domain) + '&sz=64';
    card.classList.add('is-visible');
  }

  function hideCard() {
    tracking = false;
    card.classList.remove('is-visible');
  }

  links.forEach(function(link) {
    link.addEventListener('mouseenter', function(e) {
      showCard(link);
      targetX = curX = e.clientX;
      targetY = curY = e.clientY;
      place(curX, curY);
      if (!reduceMotion) {
        tracking = true;
        if (!rafId) rafId = requestAnimationFrame(loop);
      }
    });

    link.addEventListener('mousemove', function(e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (reduceMotion) {
        curX = targetX;
        curY = targetY;
        place(curX, curY);
      }
    });

    link.addEventListener('mouseleave', hideCard);

    // Keyboard support — anchor the card just below the focused link
    link.addEventListener('focus', function() {
      showCard(link);
      tracking = false;
      var r = link.getBoundingClientRect();
      var h = card.offsetHeight || 80;
      var top = r.bottom + 8;
      if (top + h + EDGE > window.innerHeight) top = r.top - h - 8;
      card.style.left = Math.max(EDGE, r.left) + 'px';
      card.style.top = Math.max(EDGE, top) + 'px';
    });

    link.addEventListener('blur', hideCard);
  });
}

// ===== Contact modal (Paper: Contact form) =====
const CONTACT_MODAL_HTML = `
<div class="contact-modal" id="contact-modal" hidden aria-hidden="true">
  <div class="contact-modal__backdrop" data-contact-close tabindex="-1"></div>
  <div class="contact-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" tabindex="-1">
    <h2 id="contact-modal-title" class="contact-modal__title">Have a project in mind? Lets work together</h2>
    <p class="contact-modal__lede">Helping startups and businesses design, build, and refine digital experiences through product design, web development, and consulting.</p>
    <form class="contact-modal__form" action="https://api.web3forms.com/submit" method="POST" novalidate>
      <input type="hidden" name="access_key" value="dc134a61-3136-4985-a5f9-c0f336201417">
      <input type="hidden" name="subject" value="New contact from your portfolio">
      <input type="checkbox" name="botcheck" class="contact-modal__honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="visually-hidden" for="contact-modal-name">Full Name</label>
      <input id="contact-modal-name" type="text" name="name" class="contact-modal__input" placeholder="Full Name" autocomplete="name" required>
      <label class="visually-hidden" for="contact-modal-email">Email</label>
      <input id="contact-modal-email" type="email" name="email" class="contact-modal__input" placeholder="Email" autocomplete="email" required>
      <label class="visually-hidden" for="contact-modal-message">Message</label>
      <textarea id="contact-modal-message" name="message" class="contact-modal__textarea" placeholder="Message" required></textarea>
      <button type="submit" class="contact-modal__submit">Submit</button>
      <p class="contact-modal__status" role="status" aria-live="polite" hidden></p>
    </form>
  </div>
</div>`;

let _contactModalAbort = null;
let _contactModalLastFocus = null;
let _contactModalOpenedViaRoute = false;
let _contactModalPrevTitle = '';

function ensureContactModalStyles() {
  if (document.querySelector('link[data-contact-modal-css]')) return;
  const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(function(link) {
    return (link.getAttribute('href') || '').indexOf('Contact/contact.css') !== -1;
  });
  if (existing) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/Contact/contact.css?v=20260805-modal-up';
  link.setAttribute('data-contact-modal-css', 'true');
  document.head.appendChild(link);
}

function ensureContactModal() {
  ensureContactModalStyles();
  let modal = document.getElementById('contact-modal');
  if (!modal) {
    document.body.insertAdjacentHTML('beforeend', CONTACT_MODAL_HTML);
    modal = document.getElementById('contact-modal');
  }
  return modal;
}

function setContactModalStatus(message, type) {
  const status = document.querySelector('#contact-modal .contact-modal__status');
  if (!status) return;
  if (!message) {
    status.hidden = true;
    status.textContent = '';
    status.classList.remove('is-error', 'is-success');
    return;
  }
  status.hidden = false;
  status.textContent = message;
  status.classList.toggle('is-error', type === 'error');
  status.classList.toggle('is-success', type === 'success');
}

function openContactModal(options) {
  options = options || {};
  const modal = ensureContactModal();
  if (!modal || modal.classList.contains('is-open')) return;

  _contactModalLastFocus = document.activeElement;
  _contactModalOpenedViaRoute = !!options.fromRoute;
  _contactModalPrevTitle = document.title;
  document.title = 'Contact | Usmaan Razzaq';

  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('contact-modal-open');

  // Force reflow so the open transition runs
  void modal.offsetWidth;
  modal.classList.add('is-open');

  if (options.pushState) {
    const path = window.location.pathname;
    const alreadyContact =
      path === '/contact/' || path === '/contact' || path === '/Contact/' || path === '/Contact';
    if (!alreadyContact) {
      history.pushState({ contactModal: true }, '', '/contact/');
      _contactModalOpenedViaRoute = true;
    }
  }

  const dialog = modal.querySelector('.contact-modal__dialog');
  const firstField = modal.querySelector('.contact-modal__input');
  window.setTimeout(function() {
    if (firstField) firstField.focus();
    else if (dialog) dialog.focus();
  }, 40);
}

function closeContactModal(options) {
  options = options || {};
  const modal = document.getElementById('contact-modal');
  if (!modal || modal.hidden) return;

  modal.classList.remove('is-open');
  document.body.classList.remove('contact-modal-open');

  const shouldRestoreHistory =
    options.restoreHistory !== false && _contactModalOpenedViaRoute;

  const finish = function() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    setContactModalStatus('');
    const form = modal.querySelector('.contact-modal__form');
    if (form && !options.keepForm) form.reset();

    if (shouldRestoreHistory) {
      const path = window.location.pathname;
      const onContact =
        path === '/contact/' || path === '/contact' || path === '/Contact/' || path === '/Contact';
      _contactModalOpenedViaRoute = false;
      if (onContact) {
        const spaEl = document.getElementById('spa-content');
        const spaPage = spaEl ? spaEl.getAttribute('data-page') : null;
        const restorePath =
          spaPage === 'about' ? '/about/' :
          spaPage === 'playground' ? '/playground/' :
          document.body.classList.contains('about-route') ? '/about/' :
          document.body.classList.contains('playground-route') ? '/playground/' :
          '/';
        history.replaceState({}, '', restorePath);
        trackVercelPageview();
      }
    } else {
      _contactModalOpenedViaRoute = false;
    }

    if (_contactModalPrevTitle) {
      document.title = _contactModalPrevTitle;
      _contactModalPrevTitle = '';
    }

    if (_contactModalLastFocus && typeof _contactModalLastFocus.focus === 'function') {
      _contactModalLastFocus.focus();
    }
    _contactModalLastFocus = null;
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    finish();
    return;
  }

  window.setTimeout(finish, 220);
}

function initContactModal() {
  ensureContactModal();

  if (_contactModalAbort) {
    _contactModalAbort.abort();
    _contactModalAbort = null;
  }
  _contactModalAbort = new AbortController();
  const signal = _contactModalAbort.signal;

  document.addEventListener('click', function(e) {
    if (e.defaultPrevented) return;

    const openTrigger = e.target.closest('[data-contact-open], a[href="/contact/"], a[href="/contact"], a[href="/Contact/"], a[href="/Contact"]');
    if (openTrigger) {
      // Allow modified clicks / new tabs to keep default navigation
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (openTrigger.target === '_blank') return;
      e.preventDefault();
      openContactModal({ pushState: true });
      return;
    }

    if (e.target.closest('[data-contact-close]')) {
      closeContactModal();
    }
  }, { signal: signal });

  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    const modal = document.getElementById('contact-modal');
    if (modal && !modal.hidden) {
      e.preventDefault();
      closeContactModal();
    }
  }, { signal: signal });

  document.addEventListener('submit', function(e) {
    const form = e.target.closest('#contact-modal .contact-modal__form');
    if (!form) return;
    e.preventDefault();

    const submitBtn = form.querySelector('.contact-modal__submit');
    const honeypot = form.querySelector('[name="botcheck"]');
    if (honeypot && honeypot.checked) return;

    const name = (form.querySelector('[name="name"]') || {}).value || '';
    const email = (form.querySelector('[name="email"]') || {}).value || '';
    const message = (form.querySelector('[name="message"]') || {}).value || '';

    if (!name.trim() || !email.trim() || !message.trim()) {
      setContactModalStatus('Please fill out all fields.', 'error');
      return;
    }

    setContactModalStatus('');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    const payload = {
      access_key: form.querySelector('[name="access_key"]').value,
      subject: form.querySelector('[name="subject"]').value,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      from_name: name.trim(),
    };

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(function(res) {
        return res.json().then(function(data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function(result) {
        if (!result.ok || !result.data || result.data.success === false) {
          throw new Error((result.data && result.data.message) || 'Something went wrong.');
        }
        form.reset();
        setContactModalStatus("Thanks — I'll get back to you soon.", 'success');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        }
      })
      .catch(function(err) {
        setContactModalStatus(err.message || 'Unable to send. Please try again.', 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        }
      });
  }, { signal: signal });
}

onDomReady(initContactModal);

// Run page-specific init hooks based on current page
function initPageHooks(page) {
  const isHome = page === 'home';
  const isPlayground = page === 'playground';
  const isAbout = page === 'about';
  const usePaperChrome = isHome || isPlayground || isAbout;
  document.body.classList.toggle('home-route', isHome);
  document.body.classList.toggle('playground-route', isPlayground);
  document.body.classList.toggle('about-route', isAbout);
  const navContainer = document.getElementById('nav-container');
  if (navContainer) {
    navContainer.hidden = usePaperChrome;
    navContainer.setAttribute('aria-hidden', usePaperChrome ? 'true' : 'false');
  }

  // Mounts embedded prototypes and sweeps any left detached by the last swap.
  // Guarded because the first call runs while main.js is still parsing, before
  // the widget script has loaded; that pass is covered by its own DOM-ready
  // init, and mounting is idempotent.
  if (window.RentedPrototype) window.RentedPrototype.init();

  if (isHome) {
    initLocalTime();
    initHomeStack();
    initHomeNavMenu();
    initThemeToggle();
  } else if (isPlayground || isAbout) {
    initHomeNavMenu();
    initThemeToggle();
  }
  // Show/hide home-only fixed elements
  var scrollHint = document.querySelector('.hero-scroll-cue');
  var bottomBlur = document.querySelector('.bottom-blur');
  var topBlur = document.querySelector('.top-blur');
  if (scrollHint) scrollHint.style.display = page === 'home' ? '' : 'none';
  if (bottomBlur) bottomBlur.style.display = page === 'home' ? '' : 'none';
  if (topBlur) topBlur.style.display = page === 'home' ? '' : 'none';

  if (page !== 'home') initHoverEffects(page);
}

// ===== SPA ROUTER =====
(function() {
  const spaContent = document.getElementById('spa-content');
  // Only init SPA router on pages that have the SPA shell
  if (!spaContent) return;

  const routes = {
    '/': 'home',
    '/playground/': 'playground',
    '/about/': 'about',
    '/contact/': 'contact'
  };

  const titles = {
    'home': 'Usmaan Razzaq — Product Designer',
    'playground': 'Playground | Usmaan Razzaq',
    'about': 'About | Usmaan Razzaq',
    'contact': 'Contact | Usmaan Razzaq'
  };

  const mainClasses = {
    'home': 'new-homepage',
    'playground': 'new-homepage',
    'about': 'new-homepage',
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

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function applyPageContent(page, html) {
    spaContent.innerHTML = html;
    spaContent.className = mainClasses[page] || '';
    spaContent.id = 'spa-content';
    spaContent.setAttribute('data-page', page);
    document.title = titles[page] || 'Usmaan Razzaq Portfolio';
    window.scrollTo(0, 0);
    initPageHooks(page);
  }

  // Swap content with View Transition when available, else opacity fade
  function swapContent(page, html) {
    isTransitioning = true;

    if (typeof document.startViewTransition === 'function' && !prefersReducedMotion()) {
      var transition = document.startViewTransition(function() {
        applyPageContent(page, html);
      });

      return transition.finished.then(function() {
        isTransitioning = false;
      }).catch(function() {
        isTransitioning = false;
      });
    }

    return new Promise(function(resolve) {
      spaContent.classList.add('spa-fade-out');

      setTimeout(function() {
        applyPageContent(page, html);
        spaContent.offsetHeight;
        spaContent.classList.remove('spa-fade-out');

        setTimeout(function() {
          isTransitioning = false;
          resolve();
        }, 350);
      }, 280);
    });
  }

  function supportsCrossDocumentViewTransitions() {
    // Same-document API is a good proxy; unsupported browsers get the JS exit fade.
    return typeof document.startViewTransition === 'function';
  }

  function navigateWithExitFade(href) {
    if (prefersReducedMotion() || supportsCrossDocumentViewTransitions()) {
      window.location.href = href;
      return;
    }

    document.documentElement.classList.add('page-exit');
    window.setTimeout(function() {
      window.location.href = href;
    }, 280);
  }

  // Navigate to a SPA route
  function navigateTo(path, pushState) {
    if (pushState === undefined) pushState = true;
    if (isTransitioning) return;

    var normalized = normalizePath(path);
    var page = routes[normalized];
    if (!page) return;

    // Contact opens as an overlay modal over the current page
    if (page === 'contact') {
      openContactModal({ pushState: pushState, fromRoute: true });
      return;
    }

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
    var modal = document.getElementById('contact-modal');
    var modalOpen = modal && !modal.hidden;

    // Closing contact modal via browser back
    if (modalOpen && page !== 'contact') {
      closeContactModal({ restoreHistory: false });
    }

    // Opening contact modal via browser forward / deep link restore
    if (page === 'contact') {
      openContactModal({ pushState: false, fromRoute: true });
      return;
    }

    if (page) {
      fetchPartial(page).then(function(html) {
        swapContent(page, html);
      }).catch(function() {
        window.location.reload();
      });
    }
  });

  // Intercept clicks on nav links + case-study / internal page exits
  document.addEventListener('click', function(e) {
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    // Skip external links, mailto, tel, hash-only, downloads, new tabs
    if (link.target === '_blank') return;
    if (link.hasAttribute('download')) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href === '#') return;
    if (href.startsWith('http') && link.hostname !== window.location.hostname) return;

    // Hash links on the same page
    if (href.charAt(0) === '#') return;

    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (err) {
      return;
    }
    if (url.origin !== window.location.origin) return;

    // SPA routes stay in-shell
    var page = getPage(url.pathname);
    if (page) {
      e.preventDefault();
      navigateTo(url.pathname);
      return;
    }

    // Full page navigations (case studies, archive, etc.)
    // View Transitions handle supporting browsers; others get a short exit fade.
    if (!supportsCrossDocumentViewTransitions() && !prefersReducedMotion()) {
      e.preventDefault();
      navigateWithExitFade(url.href);
    }
  });

  // Expose router globally for logo click handler
  window.spaRouter = {
    navigateTo: navigateTo,
    openContactModal: openContactModal,
    closeContactModal: closeContactModal,
  };

  // Pre-cache home from the initial DOM before init hooks mutate attributes
  // (e.g. aria-pressed). Caching after init poisoned SPA restores.
  cache.set('home', spaContent.innerHTML);

  // On initial load, detect the current route from URL (for htaccess fallback)
  var initialPage = getPage(window.location.pathname);
  if (initialPage === 'contact') {
    // Deep link: keep home underneath and open the contact modal
    initPageHooks('home');
    openContactModal({ pushState: false, fromRoute: true });
  } else if (initialPage && initialPage !== 'home') {
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
})();

// ===== Full-page exit transitions (case studies and other non-SPA shells) =====
(function initFullPageTransitions() {
  // SPA shell already intercepts same-origin navigations in the router above
  if (document.getElementById('spa-content')) return;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function supportsViewTransitions() {
    return typeof document.startViewTransition === 'function';
  }

  document.addEventListener('click', function(e) {
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest('a');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;
    if (link.target === '_blank') return;
    if (link.hasAttribute('download')) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href === '#') return;
    if (href.charAt(0) === '#') return;

    var url;
    try {
      url = new URL(href, window.location.href);
    } catch (err) {
      return;
    }
    if (url.origin !== window.location.origin) return;
    if (url.href === window.location.href) return;

    // Supporting browsers animate via @view-transition; others get a short fade-out
    if (supportsViewTransitions() || prefersReducedMotion()) return;

    e.preventDefault();
    document.documentElement.classList.add('page-exit');
    window.setTimeout(function() {
      window.location.href = url.href;
    }, 280);
  });
})();

// ===== Initial page hooks for non-SPA pages =====
// Work Directory - only runs on non-SPA pages (SPA handles this via initPageHooks)
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('spa-content')) return; // SPA handles this
  if (document.body.classList.contains('playground-route') || document.querySelector('.paper-home__nav')) {
    initHomeNavMenu();
  }
  initThemeToggle();
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
  initLocalTime();
});

// Inspiration preview card - only on non-SPA pages
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('spa-content')) return;
  initInspirationPreview();
});
