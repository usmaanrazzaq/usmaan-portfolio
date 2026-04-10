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
  var line = chart.querySelector('.chart-line');
  if (!line) return;

  var length = line.getTotalLength();
  line.style.setProperty('--chart-length', length);
  line.style.strokeDasharray = length;
  line.style.strokeDashoffset = length;

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
        if (chart.classList.contains('chart-animated')) return;

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
