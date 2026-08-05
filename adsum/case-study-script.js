function bootAdsumCaseStudy() {
  if (typeof initChartScrollTriggers === 'function') {
    initChartScrollTriggers();
  }
  if (typeof initMetricUnderlineScrollTriggers === 'function') {
    initMetricUnderlineScrollTriggers();
  }
  initPaperCsLightbox();
  initPaperCsCarousel();
}

function initPaperCsLightbox() {
  var overlay = document.getElementById('lightbox');
  if (!overlay) return;

  var imgEl = document.getElementById('lightbox-img');
  var chartEl = document.getElementById('lightbox-chart');
  var closeBtn = overlay.querySelector('.lightbox-close');
  var lastFocus = null;
  var imageSelector = '.paper-cs__hero img, .paper-cs__shot img, .paper-cs__carousel-slide img';
  var chartSelector = '.paper-cs__charts .chart-card';

  document.querySelectorAll(imageSelector).forEach(function (img) {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', (img.alt || 'Image') + ' — enlarge');
    img.classList.add('paper-cs__zoomable');
  });

  document.querySelectorAll(chartSelector).forEach(function (card) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    var label = card.querySelector('svg') && card.querySelector('svg').getAttribute('aria-label');
    card.setAttribute('aria-label', (label || 'Chart') + ' — enlarge');
    card.classList.add('paper-cs__zoomable');
  });

  function rewriteSvgIds(svg) {
    var idMap = {};
    svg.querySelectorAll('[id]').forEach(function (node) {
      var oldId = node.id;
      var newId = 'lb-' + oldId + '-' + Math.random().toString(36).slice(2, 7);
      idMap[oldId] = newId;
      node.id = newId;
    });

    svg.querySelectorAll('*').forEach(function (node) {
      ['fill', 'stroke', 'filter', 'clip-path', 'mask'].forEach(function (attr) {
        var value = node.getAttribute(attr);
        if (!value || value.indexOf('url(#') === -1) return;
        Object.keys(idMap).forEach(function (oldId) {
          value = value.split('url(#' + oldId + ')').join('url(#' + idMap[oldId] + ')');
        });
        node.setAttribute(attr, value);
      });
    });

    return svg;
  }

  function openImage(img) {
    if (chartEl) {
      chartEl.innerHTML = '';
      chartEl.hidden = true;
    }
    imgEl.hidden = false;
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt || '';
    showOverlay();
  }

  function openChart(card) {
    var svg = card.querySelector('svg');
    if (!svg || !chartEl) return;

    imgEl.removeAttribute('src');
    imgEl.alt = '';
    imgEl.hidden = true;
    chartEl.hidden = false;
    chartEl.innerHTML = '';

    var clone = rewriteSvgIds(svg.cloneNode(true));
    clone.removeAttribute('aria-label');
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('chart-animated');
    clone.querySelectorAll('.chart-line').forEach(function (line) {
      line.style.strokeDasharray = 'none';
      line.style.strokeDashoffset = '0';
    });

    var shell = document.createElement('div');
    shell.className = 'chart-card lightbox-chart-card chart-animated';
    shell.appendChild(clone);
    chartEl.appendChild(shell);
    showOverlay();
  }

  function showOverlay() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    overlay.offsetHeight;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeOverlay() {
    if (!overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';

    window.setTimeout(function () {
      if (overlay.classList.contains('active')) return;
      overlay.hidden = true;
      imgEl.removeAttribute('src');
      imgEl.alt = '';
      if (chartEl) chartEl.innerHTML = '';
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }, 280);
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest(imageSelector);
    if (img) {
      e.preventDefault();
      openImage(img);
      return;
    }

    var chart = e.target.closest(chartSelector);
    if (chart) {
      e.preventDefault();
      openChart(chart);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      e.preventDefault();
      closeOverlay();
      return;
    }

    if (e.key !== 'Enter' && e.key !== ' ') return;

    var img = e.target.closest(imageSelector);
    if (img && e.target === img) {
      e.preventDefault();
      openImage(img);
      return;
    }

    var chart = e.target.closest(chartSelector);
    if (chart && e.target === chart) {
      e.preventDefault();
      openChart(chart);
    }
  });

  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeOverlay();
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.classList.contains('lightbox-stage')) {
      closeOverlay();
    }
  });
}

function initPaperCsCarousel() {
  var root = document.querySelector('[data-carousel]');
  if (!root) return;

  var track = root.querySelector('.paper-cs__carousel-track');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.paper-cs__carousel-slide'));
  var dotsHost = root.querySelector('.paper-cs__carousel-dots');
  var prevBtn = root.querySelector('[data-carousel-prev]');
  var nextBtn = root.querySelector('[data-carousel-next]');
  if (!track || slides.length < 2 || !dotsHost || !prevBtn || !nextBtn) return;

  var index = 0;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'paper-cs__carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to campaign ' + (i + 1));
    dot.addEventListener('click', function () {
      goTo(i);
    });
    dotsHost.appendChild(dot);
  });

  var dots = dotsHost.querySelectorAll('.paper-cs__carousel-dot');

  function goTo(nextIndex) {
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    if (reduceMotion) {
      track.style.transition = 'none';
    } else {
      track.style.transition = '';
    }
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
  }

  prevBtn.addEventListener('click', function () {
    goTo(index - 1);
  });
  nextBtn.addEventListener('click', function () {
    goTo(index + 1);
  });

  var startX = 0;
  var deltaX = 0;
  var dragging = false;

  track.addEventListener('pointerdown', function (e) {
    dragging = true;
    startX = e.clientX;
    deltaX = 0;
    track.setPointerCapture(e.pointerId);
    track.style.transition = 'none';
  });

  track.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    deltaX = e.clientX - startX;
    track.style.transform = 'translateX(calc(' + (-index * 100) + '% + ' + deltaX + 'px))';
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    if (Math.abs(deltaX) > 60) {
      goTo(deltaX < 0 ? index + 1 : index - 1);
    } else {
      goTo(index);
    }
  }

  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
    }
  });

  goTo(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootAdsumCaseStudy);
} else {
  bootAdsumCaseStudy();
}
