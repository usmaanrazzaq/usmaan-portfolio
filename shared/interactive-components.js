// ===== INTERACTIVE COMPONENTS =====
// Before/after image slider, animated stat counters, image hotspot annotations.
// Requires GSAP core + ScrollTrigger to be loaded before this file.

// --- Before/After Image Comparison Slider ---
function initImageCompare() {
  var comparisons = document.querySelectorAll('[data-compare]');
  if (!comparisons.length) return;

  comparisons.forEach(function(container) {
    var afterLayer = container.querySelector('.compare-after');
    var handle = container.querySelector('.compare-handle');
    if (!afterLayer || !handle) return;

    var isDragging = false;
    var position = 50; // percent

    function updatePosition(pct) {
      pct = Math.max(0, Math.min(100, pct));
      position = pct;
      afterLayer.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }

    function getPercent(clientX) {
      var rect = container.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    // Pointer events
    handle.addEventListener('pointerdown', function(e) {
      isDragging = true;
      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    container.addEventListener('pointermove', function(e) {
      if (!isDragging) return;
      updatePosition(getPercent(e.clientX));
    });

    container.addEventListener('pointerup', function() {
      isDragging = false;
    });

    // Click anywhere on the container to jump
    container.addEventListener('click', function(e) {
      if (e.target.closest('.compare-handle')) return;
      updatePosition(getPercent(e.clientX));
    });

    // Keyboard support
    handle.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        updatePosition(position - 5);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        updatePosition(position + 5);
      }
    });

    // Initialize at 50%
    updatePosition(50);
  });
}


// --- Animated Stat Counters ---
function initStatCounters() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function() {
    counters.forEach(function(counter) {
      var target = parseFloat(counter.dataset.target);
      var valueEl = counter.querySelector('.stat-value');
      if (!valueEl || isNaN(target)) return;

      var prefix = counter.dataset.prefix || '';
      var suffix = counter.dataset.suffix || '';
      var decimals = (counter.dataset.decimals) ? parseInt(counter.dataset.decimals) : 0;

      valueEl.textContent = prefix + '0' + suffix;

      var obj = { val: 0 };

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: function() {
          gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function() {
              valueEl.textContent = prefix + obj.val.toFixed(decimals) + suffix;
            },
            onComplete: function() {
              valueEl.textContent = prefix + target.toFixed(decimals) + suffix;
            }
          });
        }
      });
    });

    return function() {};
  });

  // Reduced motion: show final values immediately
  mm.add('(prefers-reduced-motion: reduce)', function() {
    counters.forEach(function(counter) {
      var target = parseFloat(counter.dataset.target);
      var valueEl = counter.querySelector('.stat-value');
      if (!valueEl || isNaN(target)) return;

      var prefix = counter.dataset.prefix || '';
      var suffix = counter.dataset.suffix || '';
      var decimals = (counter.dataset.decimals) ? parseInt(counter.dataset.decimals) : 0;

      valueEl.textContent = prefix + target.toFixed(decimals) + suffix;
    });

    return function() {};
  });
}


// --- Image Hotspot Annotations ---
function initAnnotatedImages() {
  var containers = document.querySelectorAll('.annotated-image');
  if (!containers.length) return;

  containers.forEach(function(container) {
    var hotspots = container.querySelectorAll('.hotspot');

    hotspots.forEach(function(hotspot) {
      var tooltipId = hotspot.dataset.annotation;
      var tooltip = document.getElementById(tooltipId);
      if (!tooltip) return;

      function showTooltip() {
        // Close any other open tooltips in this container
        container.querySelectorAll('.annotation-tooltip.visible').forEach(function(t) {
          if (t !== tooltip) hideTooltipEl(t);
        });

        tooltip.hidden = false;
        tooltip.classList.add('visible');

        if (typeof gsap !== 'undefined') {
          gsap.fromTo(tooltip,
            { opacity: 0, scale: 0.9, y: 5 },
            { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'expo.out' }
          );
        }
      }

      function hideTooltipEl(el) {
        el.classList.remove('visible');
        if (typeof gsap !== 'undefined') {
          gsap.to(el, {
            opacity: 0, scale: 0.9, y: 5, duration: 0.2, ease: 'expo.in',
            onComplete: function() { el.hidden = true; }
          });
        } else {
          el.hidden = true;
        }
      }

      function hideTooltip() {
        hideTooltipEl(tooltip);
      }

      // Toggle on click
      hotspot.addEventListener('click', function(e) {
        e.stopPropagation();
        if (tooltip.classList.contains('visible')) {
          hideTooltip();
        } else {
          showTooltip();
        }
      });

      // Close on Escape
      hotspot.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && tooltip.classList.contains('visible')) {
          hideTooltip();
          hotspot.focus();
        }
      });
    });

    // Close tooltips when clicking outside
    document.addEventListener('click', function(e) {
      if (!container.contains(e.target)) {
        container.querySelectorAll('.annotation-tooltip.visible').forEach(function(t) {
          t.classList.remove('visible');
          t.hidden = true;
        });
      }
    });
  });
}


// --- Chart Animation (shared) ---
// Measures polyline length, sets CSS vars, then adds .chart-animated to trigger CSS transitions.
// Called from carousel goTo() on homepage, and via ScrollTrigger on case study pages.
function initChartAnimation(chart) {
  var lines = chart.querySelectorAll('.chart-line');
  if (!lines.length) return;

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

  chart.classList.add('chart-animated');
}

// Auto-init charts on case study pages via ScrollTrigger
function initChartScrollTriggers() {
  var charts = document.querySelectorAll('.chart-card[data-chart]');
  if (!charts.length) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    var mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', function() {
      charts.forEach(function(chart) {
        if (chart._chartScrollTriggerInit || chart.classList.contains('chart-animated')) return;
        if (!chart.offsetParent && chart.getClientRects().length === 0) return;
        chart._chartScrollTriggerInit = true;

        ScrollTrigger.create({
          trigger: chart,
          start: 'top 80%',
          once: true,
          onEnter: function() {
            initChartAnimation(chart);
          }
        });
      });

      return function() {};
    });
  }
}


// --- Globe Reach Animation (shared) ---
function initGlobeReachAnimation(globe) {
  if (!globe || globe.classList.contains('globe-animated')) return;

  var sphere = globe.querySelector('.globe-sphere');
  var markers = globe.querySelectorAll('.globe-marker');
  var dots = globe.querySelectorAll('.globe-marker-dot');
  if (!sphere || typeof gsap === 'undefined') return;

  gsap.set(sphere, { opacity: 0, scale: 0.94, transformOrigin: '260px 148px' });
  gsap.set(markers, { opacity: 0 });
  gsap.set(dots, { scale: 0, transformOrigin: 'center center' });

  globe.classList.add('globe-animated');

  var tl = gsap.timeline({
    onComplete: function() {
      globe.classList.add('globe-flowing');
    }
  });

  tl.to(sphere, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' });
  tl.to(markers, { opacity: 1, duration: 0.4, stagger: 0.12, ease: 'power2.out' }, 0.35);
  tl.to(dots, { scale: 1, duration: 0.35, stagger: 0.1, ease: 'back.out(2)' }, 0.5);
}

function tryInitGlobeInEntry(entry) {
  if (!entry) return;
  var globe = entry.querySelector('[data-globe-reach]');
  if (!globe || globe.classList.contains('globe-animated')) return;
  if (!globe.offsetParent && globe.getClientRects().length === 0) return;

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }

  var rect = globe.getBoundingClientRect();
  if (rect.top <= window.innerHeight * 0.85 && rect.bottom > 0) {
    initGlobeReachAnimation(globe);
  }
}

function initGlobeReachScrollTriggers() {
  var globes = document.querySelectorAll('[data-globe-reach]');
  if (!globes.length) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    var mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', function() {
      globes.forEach(function(globe) {
        if (globe._globeScrollTriggerInit || globe.classList.contains('globe-animated')) return;
        if (!globe.offsetParent && globe.getClientRects().length === 0) return;
        globe._globeScrollTriggerInit = true;

        ScrollTrigger.create({
          trigger: globe,
          start: 'top 85%',
          once: true,
          onEnter: function() {
            initGlobeReachAnimation(globe);
          }
        });
      });

      return function() {};
    });

    mm.add('(prefers-reduced-motion: reduce)', function() {
      globes.forEach(function(globe) {
        globe.classList.add('globe-animated', 'globe-flowing');
        globe.querySelectorAll('.globe-marker').forEach(function(el) {
          el.style.opacity = '1';
        });
        globe.querySelectorAll('.globe-marker-dot').forEach(function(el) {
          el.style.transform = 'scale(1)';
        });
      });
      return function() {};
    });
  }
}


// --- Competitive Analysis Animated Map ---
function initCompetitiveAnalysis() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var containers = document.querySelectorAll('[data-competitive-analysis]');
  if (!containers.length) return;

  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function() {
    containers.forEach(function(container) {
      var svg = container.querySelector('.comp-map__svg');
      var dots = container.querySelectorAll('.comp-map__dot');
      var names = container.querySelectorAll('.comp-map__name');
      var zone = container.querySelector('.comp-map__zone');
      var zoneRect = zone ? zone.querySelector('rect') : null;
      var zoneLabel = zone ? zone.querySelector('.comp-map__zone-label') : null;
      var gapCards = container.querySelectorAll('.comp-gap-card');

      if (!svg || !dots.length) return;

      // Set initial states — dots start at center of chart, invisible
      dots.forEach(function(dot) {
        gsap.set(dot, {
          attr: { transform: 'translate(300, 220)' },
          opacity: 0
        });
        var circle = dot.querySelector('circle');
        var label = dot.querySelector('.comp-map__dot-label');
        if (circle) gsap.set(circle, { scale: 0, transformOrigin: 'center center' });
        if (label) gsap.set(label, { opacity: 0 });
      });

      // Gap cards start hidden
      gsap.set(gapCards, { opacity: 0, y: 15 });

      ScrollTrigger.create({
        trigger: container,
        start: 'top 75%',
        once: true,
        onEnter: function() {
          var tl = gsap.timeline();

          // Phase 1: Axis lines draw in
          var axes = container.querySelectorAll('.comp-map__axis');
          if (axes.length) {
            axes.forEach(function(axis) {
              var length = 0;
              try {
                length = axis.getTotalLength();
              } catch (e) {
                return;
              }
              gsap.set(axis, {
                strokeDasharray: length,
                strokeDashoffset: length
              });
            });
            tl.to(axes, {
              strokeDashoffset: 0,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.1
            });
          }

          // Phase 2: Competitor dots fly out from center to their positions
          dots.forEach(function(dot, i) {
            var targetX = parseFloat(dot.getAttribute('data-x'));
            var targetY = parseFloat(dot.getAttribute('data-y'));
            var circle = dot.querySelector('circle');
            var label = dot.querySelector('.comp-map__dot-label');

            tl.to(dot, {
              attr: { transform: 'translate(' + targetX + ', ' + targetY + ')' },
              opacity: 1,
              duration: 0.55,
              ease: 'expo.out'
            }, i === 0 ? '-=0.1' : '-=0.35');

            if (circle) {
              tl.to(circle, {
                scale: 1,
                duration: 0.4,
                ease: 'back.out(1.4)'
              }, '<');
            }

            if (label) {
              tl.to(label, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
              }, '<+=0.15');
            }
          });

          // Phase 3: Name labels fade in
          tl.to(names, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.06
          }, '-=0.2');

          // Phase 4: Opportunity zone appears
          if (zoneRect) {
            tl.to(zoneRect, {
              opacity: 0.8,
              duration: 0.5,
              ease: 'power2.out'
            }, '-=0.1');
          }
          if (zoneLabel) {
            tl.to(zoneLabel, {
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out'
            }, '-=0.3');
          }

          // Phase 5: Gap cards stagger in
          tl.to(gapCards, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'expo.out',
            stagger: 0.12
          }, '-=0.1');
        }
      });
    });

    return function() {};
  });

  // Reduced motion: show everything immediately
  mm.add('(prefers-reduced-motion: reduce)', function() {
    containers.forEach(function(container) {
      var dots = container.querySelectorAll('.comp-map__dot');
      var names = container.querySelectorAll('.comp-map__name');
      var zoneRect = container.querySelector('.comp-map__zone rect');
      var zoneLabel = container.querySelector('.comp-map__zone-label');
      var gapCards = container.querySelectorAll('.comp-gap-card');

      dots.forEach(function(dot) {
        var targetX = parseFloat(dot.getAttribute('data-x'));
        var targetY = parseFloat(dot.getAttribute('data-y'));
        dot.setAttribute('transform', 'translate(' + targetX + ', ' + targetY + ')');
        dot.style.opacity = '1';
        var circle = dot.querySelector('circle');
        var label = dot.querySelector('.comp-map__dot-label');
        if (circle) circle.style.transform = 'scale(1)';
        if (label) label.style.opacity = '1';
      });

      names.forEach(function(n) { n.style.opacity = '1'; });
      if (zoneRect) zoneRect.style.opacity = '0.8';
      if (zoneLabel) zoneLabel.style.opacity = '1';
      gapCards.forEach(function(card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    });

    return function() {};
  });
}


// --- Design Evolution Stepper ---
function initDesignEvolution() {
  var containers = document.querySelectorAll('[data-design-evolution]');
  if (!containers.length) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  containers.forEach(function(container) {
    var tabs = container.querySelectorAll('.evolution-tab');
    var stages = container.querySelectorAll('.evolution-stage');
    var captions = container.querySelectorAll('.evolution-caption');
    var indicator = container.querySelector('.evolution-tab-indicator');
    var prevBtn = container.querySelector('.evolution-arrow--prev');
    var nextBtn = container.querySelector('.evolution-arrow--next');
    var counter = container.querySelector('.evolution-counter');
    var currentIndex = 0;
    var stageCount = stages.length;
    var isAnimating = false;

    function positionIndicator(tabEl, instant) {
      if (!indicator || !tabEl) return;
      var tabsContainer = container.querySelector('.evolution-tabs');
      var containerLeft = tabsContainer.getBoundingClientRect().left + parseFloat(getComputedStyle(tabsContainer).paddingLeft);
      var tabRect = tabEl.getBoundingClientRect();
      var left = tabRect.left - containerLeft;
      var width = tabRect.width;

      if (instant || prefersReducedMotion) {
        indicator.style.transition = 'none';
        indicator.style.left = left + 'px';
        indicator.style.width = width + 'px';
        indicator.offsetHeight;
        indicator.style.transition = '';
      } else {
        indicator.style.left = left + 'px';
        indicator.style.width = width + 'px';
      }
    }

    function goTo(index, instant) {
      if (index < 0 || index >= stageCount || (index === currentIndex && !instant)) return;
      if (isAnimating && !instant) return;

      var prevIndex = currentIndex;
      currentIndex = index;

      tabs.forEach(function(tab, i) {
        var isActive = i === currentIndex;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      positionIndicator(tabs[currentIndex], instant);

      if (typeof gsap !== 'undefined' && !prefersReducedMotion && !instant) {
        isAnimating = true;

        var outgoing = stages[prevIndex];
        var incoming = stages[currentIndex];

        gsap.set(incoming, { opacity: 0 });

        var tl = gsap.timeline({
          onComplete: function() {
            outgoing.classList.remove('active');
            incoming.classList.add('active');
            gsap.set(incoming, { clearProps: 'opacity' });
            isAnimating = false;
          }
        });

        tl.to(outgoing, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in'
        });

        tl.add(function() {
          outgoing.classList.remove('active');
          incoming.classList.add('active');
          gsap.set(incoming, { opacity: 0 });
        });

        tl.to(incoming, {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out'
        });
      } else {
        stages.forEach(function(stage, i) {
          stage.classList.toggle('active', i === currentIndex);
        });
      }

      captions.forEach(function(cap, i) {
        cap.classList.toggle('active', i === currentIndex);
      });

      if (counter) {
        counter.textContent = (currentIndex + 1) + ' / ' + stageCount;
      }

      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === stageCount - 1;
    }

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var idx = parseInt(tab.getAttribute('data-index'), 10);
        if (!isNaN(idx)) goTo(idx);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function() { goTo(currentIndex - 1); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function() { goTo(currentIndex + 1); });
    }

    container.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(currentIndex + 1);
      }
    });

    tabs.forEach(function(tab, i) {
      tab.setAttribute('tabindex', i === 0 ? '0' : '-1');
    });

    positionIndicator(tabs[0], true);
    window.addEventListener('resize', function() {
      positionIndicator(tabs[currentIndex], true);
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      gsap.set(container, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        once: true,
        onEnter: function() {
          gsap.to(container, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'expo.out'
          });
        }
      });
    }
  });
}


// --- Phone Mockup Interactive ---
function initPhoneMockup() {
  var containers = document.querySelectorAll('[data-phone-mockup]');
  if (!containers.length) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  containers.forEach(function(container) {
    var views = container.querySelectorAll('.phone-view');
    var hotspots = container.querySelectorAll('.phone-hotspot');
    var hint = container.querySelector('.phone-hint');
    var isAnimating = false;
    var hintDismissed = false;

    function getActiveView() {
      return container.querySelector('.phone-view.active');
    }

    function goToView(targetName) {
      var current = getActiveView();
      var target = container.querySelector('.phone-view[data-view="' + targetName + '"]');
      if (!target || target === current || isAnimating) return;

      if (!hintDismissed && hint) {
        hintDismissed = true;
        hint.classList.add('hidden');
      }

      if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        isAnimating = true;

        gsap.set(target, { opacity: 0 });

        var tl = gsap.timeline({
          onComplete: function() {
            current.classList.remove('active');
            target.classList.add('active');
            gsap.set(target, { clearProps: 'opacity' });
            isAnimating = false;
          }
        });

        tl.to(current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        });

        tl.add(function() {
          current.classList.remove('active');
          target.classList.add('active');
          gsap.set(target, { opacity: 0 });
        });

        tl.to(target, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        current.classList.remove('active');
        target.classList.add('active');
      }
    }

    hotspots.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var dest = btn.getAttribute('data-goto');
        if (dest) goToView(dest);
      });
    });

    container.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var active = getActiveView();
        if (active && active.getAttribute('data-view') !== 'home') {
          goToView('home');
        }
      }
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      gsap.set(container, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: container,
        start: 'top 85%',
        once: true,
        onEnter: function() {
          gsap.to(container, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'expo.out'
          });
        }
      });
    }
  });
}


// --- User Research Findings ---
function initResearchFindings() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var containers = document.querySelectorAll('[data-research-findings]');
  if (!containers.length) return;

  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function() {
    containers.forEach(function(container) {
      var intro = container.querySelector('.research-findings__intro');
      var groups = container.querySelectorAll('.research-findings__group');
      var rows = container.querySelectorAll('.research-findings__row');
      var connector = container.querySelector('.research-findings__connector');
      var response = container.querySelector('.research-findings__response');
      var chips = container.querySelectorAll('.research-findings__chip');

      // Set initial states
      if (intro) gsap.set(intro, { opacity: 0, y: 15 });
      gsap.set(groups, { opacity: 0, y: 18, scale: 0.98 });
      gsap.set(rows, { opacity: 0, y: 12 });
      if (connector) gsap.set(connector, { opacity: 0, scaleX: 0.72, transformOrigin: 'center center' });
      if (response) gsap.set(response, { opacity: 0, y: 14 });
      gsap.set(chips, { opacity: 0, y: 8 });

      ScrollTrigger.create({
        trigger: container,
        start: 'top 75%',
        once: true,
        onEnter: function() {
          var tl = gsap.timeline();

          // Phase 1: Intro blurb fades in
          if (intro) {
            tl.to(intro, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'expo.out'
            });
          }

          // Phase 2: Audience lanes enter
          tl.to(groups, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: 'expo.out',
            stagger: 0.1
          }, intro ? '-=0.2' : '0');

          // Phase 3: Pain point rows stagger in
          tl.to(rows, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
            stagger: 0.05
          }, '-=0.2');

          // Phase 4: Connect research themes to the design response
          if (connector) {
            tl.to(connector, {
              opacity: 1,
              scaleX: 1,
              duration: 0.45,
              ease: 'power2.out'
            }, '-=0.05');
          }

          if (response) {
            tl.to(response, {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: 'power2.out'
            }, connector ? '-=0.18' : '-=0.05');
          }

          tl.to(chips, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power2.out',
            stagger: 0.06
          }, response ? '-=0.18' : '-=0.05');
        }
      });
    });

    return function() {};
  });

  // Reduced motion: show everything immediately
  mm.add('(prefers-reduced-motion: reduce)', function() {
    containers.forEach(function(container) {
      var intro = container.querySelector('.research-findings__intro');
      var groups = container.querySelectorAll('.research-findings__group');
      var rows = container.querySelectorAll('.research-findings__row');
      var connector = container.querySelector('.research-findings__connector');
      var response = container.querySelector('.research-findings__response');
      var chips = container.querySelectorAll('.research-findings__chip');

      if (intro) {
        intro.style.opacity = '1';
        intro.style.transform = 'none';
      }
      groups.forEach(function(group) {
        group.style.opacity = '1';
        group.style.transform = 'none';
      });
      rows.forEach(function(r) {
        r.style.opacity = '1';
        r.style.transform = 'none';
      });
      if (connector) {
        connector.style.opacity = '1';
        connector.style.transform = 'none';
      }
      if (response) {
        response.style.opacity = '1';
        response.style.transform = 'none';
      }
      chips.forEach(function(chip) {
        chip.style.opacity = '1';
        chip.style.transform = 'none';
      });
    });

    return function() {};
  });
}
