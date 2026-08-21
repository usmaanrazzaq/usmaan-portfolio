function bootOtrsCaseStudy() {
  if (typeof initChartScrollTriggers === 'function') {
    initChartScrollTriggers();
  }
  if (typeof initMetricUnderlineScrollTriggers === 'function') {
    initMetricUnderlineScrollTriggers();
  }
  if (typeof initGlobeReachScrollTriggers === 'function') {
    initGlobeReachScrollTriggers();
  }
  initPaperCsLightbox();
}

function initPaperCsLightbox() {
  var overlay = document.getElementById('lightbox');
  if (!overlay) return;

  var imgEl = document.getElementById('lightbox-img');
  var chartEl = document.getElementById('lightbox-chart');
  var closeBtn = overlay.querySelector('.lightbox-close');
  var lastFocus = null;
  var imageSelector = '.paper-cs__hero img, .paper-cs__shot img';
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootOtrsCaseStudy);
} else {
  bootOtrsCaseStudy();
}
