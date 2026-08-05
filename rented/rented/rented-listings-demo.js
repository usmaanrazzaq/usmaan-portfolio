/* Self-running Listings demo — Paper Tags frame. Search stays put;
   product cards stack in on a loop. */

(function () {
  'use strict';

  var HOLD_MS = 2200;
  var RESET_GAP_MS = 320;
  var CANVAS_W = 391;
  var CANVAS_H = 560;
  var GUTTER = 40;

  var reduceQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  function prefersReduce() {
    return !!(reduceQuery && reduceQuery.matches);
  }

  function prime(stage) {
    if (!stage) return;
    stage.classList.add('is-intro');
    void stage.offsetWidth;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        stage.classList.remove('is-intro');
      });
    });
  }

  function mount(root) {
    var host = root.querySelector('.rld');
    var stage = root.querySelector('[data-rld-stage]');
    if (!host || !stage) return;

    function fit() {
      var w = root.clientWidth - GUTTER;
      var h = root.clientHeight - GUTTER;
      if (w <= 0 || h <= 0) return;
      var scale = Math.min(w / CANVAS_W, h / CANVAS_H);
      host.style.setProperty('--rld-scale', Math.min(Math.max(scale, 0.45), 1.6).toFixed(4));
    }

    fit();
    if (window.ResizeObserver) {
      new ResizeObserver(fit).observe(root);
    } else {
      window.addEventListener('resize', fit);
    }

    if (prefersReduce()) {
      stage.classList.remove('is-intro');
      return;
    }

    var timer = null;
    var running = false;
    var inView = false;

    function clearTimer() {
      if (timer === null) return;
      window.clearTimeout(timer);
      timer = null;
    }

    function cycle() {
      timer = null;
      if (!running) return;

      prime(stage);
      timer = window.setTimeout(function () {
        timer = null;
        if (!running) return;
        stage.classList.add('is-intro');
        timer = window.setTimeout(cycle, RESET_GAP_MS);
      }, HOLD_MS);
    }

    function start() {
      if (running || prefersReduce()) return;
      running = true;
      clearTimer();
      cycle();
    }

    function stop() {
      running = false;
      clearTimer();
      stage.classList.add('is-intro');
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
          stage.classList.remove('is-intro');
        } else if (inView) {
          start();
        }
      });
    }
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-rld]'), mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
