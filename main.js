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
            <li><a href="/projects/">Projects</a></li>
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

    if (page === 'projects') {
      // Project card 3D tilt
      var cards = document.querySelectorAll('.project-card');

      cards.forEach(function(card) {
        var xTo = gsap.quickTo(card, "rotateY", { duration: 0.3, ease: "power2.out" });
        var yTo = gsap.quickTo(card, "rotateX", { duration: 0.3, ease: "power2.out" });

        card.style.transformStyle = "preserve-3d";
        card.style.perspective = "800px";
        // Wrap in a perspective container
        card.parentElement.style.perspective = "800px";

        card.addEventListener("mousemove", function(e) {
          var rect = card.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
          var y = (e.clientY - rect.top) / rect.height - 0.5;
          xTo(x * 4);   // max 2 degrees
          yTo(-y * 4);  // max 2 degrees
        });

        card.addEventListener("mouseleave", function() {
          xTo(0);
          yTo(0);
        });
      });

      // Staggered card entry animation
      gsap.from(".project-card", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "expo.out",
        clearProps: "all"
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
        activateEntryMedia(targetEntry);
        // Reset carousel to first slide
        var carousel = targetEntry.querySelector('[data-carousel]');
        if (carousel && carousel._carouselGoTo) carousel._carouselGoTo(0, true);
        targetEntry.offsetHeight;

        // After the old entry finishes fading out, remove it from the grid
        setTimeout(() => {
          currentEntry.classList.remove('fading-out');
          deactivateEntryMedia(currentEntry);
          isSwitching = false;
        }, 320);

        // Stagger-in meta groups on the new entry
        if (typeof gsap !== 'undefined') {
          var metaGroups = targetEntry.querySelectorAll('.meta-group');
          if (metaGroups.length) {
            gsap.from(metaGroups, {
              opacity: 0,
              y: 10,
              duration: 0.45,
              ease: 'expo.out',
              stagger: 0.06,
              delay: 0.1
            });
          }
        }
      } else if (targetEntry) {
        workEntries.forEach(entry => {
          entry.classList.remove('active');
          deactivateEntryMedia(entry);
        });
        targetEntry.classList.add('active');
        activateEntryMedia(targetEntry);
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
  const availabilityIndicator = document.querySelector('.availability-indicator');
  const availabilityText = document.getElementById('availability-text');

  // Availability config — single source of truth.
  // status: 'available' | 'limited' | 'booked'
  // bookedThrough: month name, used only when status === 'booked'
  const availability = {
    status: 'available',
    bookedThrough: 'April',
  };

  if (availabilityIndicator && availabilityText) {
    availabilityIndicator.classList.remove('limited', 'booked', 'not-available');

    if (availability.status === 'limited') {
      availabilityIndicator.classList.add('limited');
      availabilityText.textContent = 'Limited availability';
    } else if (availability.status === 'booked') {
      availabilityIndicator.classList.add('booked');
      availabilityText.textContent = `Booked through ${availability.bookedThrough}`;
    } else {
      availabilityText.textContent = 'Available for work';
    }
  }
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

// ===== CASE STUDY NAVIGATION =====
function initCaseStudyNav() {
  var container = document.querySelector('.case-study-container');
  if (!container) return;

  var CASE_STUDIES = [
    { path: '/adsum/', match: '/adsum', name: 'Adsum NYC' },
    { path: '/National-Muslim-Youth-Association/muslim-youth-website/case-study.html', match: 'muslim-youth', name: 'National Muslim Youth Association' },
    { path: '/On-The-Run-Studio/on-the-run-studio/OTRS-Case-Study.html', match: 'on-the-run-studio', name: 'On The Run Studio' },
    { path: '/Rented/rented/', match: '/rented', name: 'Rented' },
    { path: '/DPR-Studio/dpr-studio/case-study.html', match: 'dpr-studio', name: 'DPR Studio' },
  ];

  var pathname = window.location.pathname.toLowerCase();

  // Find current case study by checking if the URL contains a unique identifier
  var currentIndex = -1;
  for (var i = 0; i < CASE_STUDIES.length; i++) {
    if (pathname.indexOf(CASE_STUDIES[i].match) !== -1) {
      currentIndex = i;
      break;
    }
  }
  if (currentIndex === -1) return;

  var len = CASE_STUDIES.length;
  var prev = CASE_STUDIES[(currentIndex - 1 + len) % len];
  var next = CASE_STUDIES[(currentIndex + 1) % len];

  var arrowSVG = '<svg class="nav-arrow" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Inject styles
  var style = document.createElement('style');
  style.textContent = [
    '.case-study-nav {',
    '  display: flex; justify-content: space-between; align-items: center;',
    '  padding: 3rem 1rem; margin-top: 3rem;',
    '  border-top: 0.5px solid rgba(43,43,43,0.15);',
    '  position: relative; z-index: 10; overflow: visible;',
    '}',
    '.case-study-nav a {',
    '  display: flex; align-items: center; gap: 0.5rem;',
    '  text-decoration: none; color: #8d8383;',
    '  font-family: "Helvetica Neue", sans-serif;',
    '  font-variation-settings: "wght" 300;',
    '  font-size: 0.875rem;',
    '  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);',
    '}',
    '.case-study-nav a:hover { color: #2b2b2b; }',
    '.case-study-nav .nav-label {',
    '  display: inline-block; overflow: hidden;',
    '  max-width: 0; opacity: 0; white-space: nowrap;',
    '  transition: max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);',
    '}',
    '.case-study-nav a:hover .nav-label {',
    '  max-width: 300px; opacity: 1;',
    '}',
    '.case-study-nav .nav-arrow {',
    '  width: 14px; height: 14px; flex-shrink: 0;',
    '  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);',
    '}',
    '.cs-nav-prev .nav-arrow { transform: scaleX(-1); }',
    '.cs-nav-prev:hover .nav-arrow { transform: scaleX(-1) translateX(3px); }',
    '.cs-nav-next:hover .nav-arrow { transform: translateX(3px); }',
    '@media (prefers-reduced-motion: reduce) {',
    '  .case-study-nav .nav-arrow { transition: none; }',
    '  .case-study-nav .nav-label { transition: none; }',
    '}',
    '@media (max-width: 768px) {',
    '  .case-study-nav { padding: 2rem 0; margin-top: 2rem; }',
    '  .case-study-nav .nav-label { max-width: 300px; opacity: 1; }',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // Build nav element
  var nav = document.createElement('nav');
  nav.className = 'case-study-nav';
  nav.setAttribute('aria-label', 'Case study navigation');
  nav.innerHTML =
    '<a href="' + prev.path + '" class="cs-nav-prev">' +
      arrowSVG +
      '<span class="nav-label">' + prev.name + '</span>' +
    '</a>' +
    '<a href="' + next.path + '" class="cs-nav-next">' +
      '<span class="nav-label">' + next.name + '</span>' +
      arrowSVG +
    '</a>';

  container.appendChild(nav);
}

// ===== CHART ANIMATION =====
function initChartAnimation(chart) {
  var line = chart.querySelector('.chart-line');
  if (!line) return;

  // Measure the polyline length and set the CSS variable
  var length = line.getTotalLength();
  line.style.setProperty('--chart-length', length);
  line.style.strokeDasharray = length;
  line.style.strokeDashoffset = length;

  // Force reflow so the browser registers the initial state
  chart.offsetHeight;

  // Add animated class to trigger CSS transitions
  chart.classList.add('chart-animated');
}

// ===== HOMEPAGE SCROLL ANIMATIONS =====
function initHomeScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function() {

    // Hero entrance — staggered fade-in + slide-up
    var heroCols = document.querySelectorAll('.hero-col');
    if (heroCols.length) {
      gsap.set(heroCols, { opacity: 0, y: 20 });
      gsap.to(heroCols, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.12,
        delay: 0.15
      });
    }

    // Work section scroll reveal
    var workSection = document.querySelector('.work-section');
    if (workSection) {
      var workDirectory = workSection.querySelector('.work-directory');
      var activeEntry = workSection.querySelector('.work-entry.active');

      if (workDirectory) gsap.set(workDirectory, { opacity: 0, x: -20 });
      if (activeEntry) gsap.set(activeEntry, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: workSection,
        start: 'top 85%',
        once: true,
        onEnter: function() {
          if (workDirectory) {
            gsap.to(workDirectory, { opacity: 1, x: 0, duration: 0.7, ease: 'expo.out' });
          }
          if (activeEntry) {
            gsap.to(activeEntry, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', delay: 0.1 });
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

// Run page-specific init hooks based on current page
function initPageHooks(page) {
  if (page === 'home') {
    initHomeTabs();
    initWorkDirectory();
    initTimestamp();
    initLightbox();
    initCarousels();
    initHomeScrollAnimations();
    if (typeof initStatCounters === 'function') initStatCounters();
  } else if (page === 'about') {
    initDropdowns();
  }
  // Initialize GSAP hover effects for all pages that need them
  initHoverEffects(page);
}

// ===== SPA ROUTER =====
(function() {
  const spaContent = document.getElementById('spa-content');
  // Only init SPA router on pages that have the SPA shell
  if (!spaContent) return;

  const routes = {
    '/': 'home',
    '/projects/': 'projects',
    '/about/': 'about',
    '/contact/': 'contact'
  };

  const titles = {
    'home': 'Usmaan Razzaq Portfolio',
    'projects': 'Projects | Usmaan Razzaq',
    'about': 'About | Usmaan Razzaq',
    'contact': 'Contact | Usmaan Razzaq'
  };

  const mainClasses = {
    'home': 'new-homepage',
    'projects': '',
    'about': '',
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

// Case Study Navigation - only on non-SPA pages
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('spa-content')) return;
  initCaseStudyNav();
});
