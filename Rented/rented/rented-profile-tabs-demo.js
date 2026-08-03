/* Self-running Profile tabs demo — cycles Listed → History → Review
   with the same thumb slide + panel stack-load as the main Rented prototype. */

(function () {
  'use strict';

  var TAP_LEAD = 200;
  var HOLD_LISTED = 2100;
  var HOLD_OTHER = 2000;
  var HOLD_BACK = 1500;

  var reduceQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  function prefersReduce() {
    return !!(reduceQuery && reduceQuery.matches);
  }

  function prime(panel) {
    if (!panel) return;
    panel.classList.add('is-intro');
    void panel.offsetWidth;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        panel.classList.remove('is-intro');
      });
    });
  }

  function mount(root) {
    var tabsEl = root.querySelector('[data-rpd-tabs]');
    var btns = tabsEl
      ? Array.prototype.slice.call(tabsEl.querySelectorAll('[data-rpd-tab]'))
      : [];
    var panels = btns.map(function (btn) {
      return root.querySelector('[data-rpd-panel="' + btn.getAttribute('data-rpd-tab') + '"]');
    });
    var tapEl = root.querySelector('[data-rpd-tap]');
    var stage = root.querySelector('.rpd');

    if (!tabsEl || btns.length !== 3 || panels.some(function (p) { return !p; })) return;

    var tabIndex = 0;
    var timer = null;
    var running = false;
    var inView = false;

    function clearTimer() {
      if (timer === null) return;
      window.clearTimeout(timer);
      timer = null;
    }

    function hideTap() {
      if (tapEl) tapEl.classList.remove('is-on');
    }

    function showTap(target) {
      if (!tapEl || !stage || !target) return;
      var stageRect = stage.getBoundingClientRect();
      var targetRect = target.getBoundingClientRect();
      if (!targetRect.width || !stageRect.width) return;

      tapEl.style.left = targetRect.left + targetRect.width / 2 - stageRect.left + 'px';
      tapEl.style.top = targetRect.top + targetRect.height / 2 - stageRect.top + 'px';
      tapEl.classList.remove('is-on');
      void tapEl.offsetWidth;
      tapEl.classList.add('is-on');
    }

    function setTab(index, force) {
      if (index === tabIndex && !force) return;
      tabIndex = index;
      tabsEl.style.setProperty('--tab', String(index));
      tabsEl.setAttribute('data-tab', String(index));

      btns.forEach(function (btn, n) {
        var selected = n === index;
        btn.classList.toggle('is-active', selected);
        var panel = panels[n];
        if (!panel) return;
        panel.hidden = !selected;
        if (selected) {
          panel.classList.add('is-active');
          prime(panel);
        } else {
          panel.classList.remove('is-active', 'is-intro');
        }
      });
    }

    function resetToListedIntro() {
      tabIndex = 0;
      tabsEl.style.setProperty('--tab', '0');
      tabsEl.setAttribute('data-tab', '0');
      btns.forEach(function (btn, n) {
        btn.classList.toggle('is-active', n === 0);
        var panel = panels[n];
        if (!panel) return;
        panel.hidden = n !== 0;
        panel.classList.toggle('is-active', n === 0);
        panel.classList.toggle('is-intro', n === 0);
      });
    }

    function after(ms, fn) {
      clearTimer();
      timer = window.setTimeout(function () {
        timer = null;
        if (!running) return;
        fn();
      }, ms);
    }

    function goHistory() {
      showTap(btns[1]);
      after(TAP_LEAD, function () {
        setTab(1);
        after(HOLD_OTHER, goReview);
      });
    }

    function goReview() {
      showTap(btns[2]);
      after(TAP_LEAD, function () {
        setTab(2);
        after(HOLD_OTHER, goListed);
      });
    }

    function goListed() {
      showTap(btns[0]);
      after(TAP_LEAD, function () {
        setTab(0);
        after(HOLD_BACK, goHistory);
      });
    }

    function start() {
      if (running || prefersReduce()) return;
      running = true;
      clearTimer();
      resetToListedIntro();
      after(400, function () {
        prime(panels[0]);
        after(HOLD_LISTED, goHistory);
      });
    }

    function stop() {
      running = false;
      clearTimer();
      hideTap();
      resetToListedIntro();
    }

    if (prefersReduce()) {
      resetToListedIntro();
      panels.forEach(function (panel) {
        panel.classList.remove('is-intro');
      });
      return;
    }

    if (window.IntersectionObserver) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (inView) return;
              inView = true;
              if (!document.hidden) start();
            } else {
              if (!inView) return;
              inView = false;
              stop();
            }
          });
        },
        { threshold: 0.35 }
      );
      observer.observe(root);
    } else {
      inView = true;
      start();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stop();
      } else if (inView) {
        start();
      }
    });

    if (reduceQuery && typeof reduceQuery.addEventListener === 'function') {
      reduceQuery.addEventListener('change', function () {
        if (prefersReduce()) {
          stop();
          panels.forEach(function (panel) {
            panel.classList.remove('is-intro');
          });
        } else if (inView) {
          start();
        }
      });
    }
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-rpd]'), mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
