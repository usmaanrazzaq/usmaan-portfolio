function bootWcmCaseStudy() {
  initPaperCsLightbox();
}

function initPaperCsLightbox() {
  var overlay = document.getElementById('lightbox');
  if (!overlay) return;

  var imgEl = document.getElementById('lightbox-img');
  var closeBtn = overlay.querySelector('.lightbox-close');
  var lastFocus = null;
  var targetSelector = '.paper-cs__hero img, .paper-cs__shot img';

  document.querySelectorAll(targetSelector).forEach(function (img) {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', (img.alt || 'Image') + ' — enlarge');
    img.classList.add('paper-cs__zoomable');
  });

  function openImage(img) {
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt || '';
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
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }, 280);
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest(targetSelector);
    if (img) {
      e.preventDefault();
      openImage(img);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      e.preventDefault();
      closeOverlay();
      return;
    }

    if (e.key !== 'Enter' && e.key !== ' ') return;

    var img = e.target.closest(targetSelector);
    if (img && e.target === img) {
      e.preventDefault();
      openImage(img);
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
  document.addEventListener('DOMContentLoaded', bootWcmCaseStudy);
} else {
  bootWcmCaseStudy();
}
