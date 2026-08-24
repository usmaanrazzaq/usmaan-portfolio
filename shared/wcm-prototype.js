/* WCM Connect self-running phone.

   Two hosts embed it, both declared with data-wcm-embed:
     full      the case study hero, with label; tap advances
     showcase  the homepage case card, a decorative demo inside a link

   The demo plays on a loop while the prototype is on screen. The showcase
   variant never takes input. */

(function (global) {
  'use strict';

  var PARTIAL_URL = '/shared/wcm-prototype.html?v=20260823-wcm-fixed-tabs';
  var TAP_LEAD = 200;
  var RETRY = 220;

  var VARIANTS = {
    full: { interactive: true, gutter: 40 },
    showcase: { interactive: false, gutter: 28, decorative: true }
  };

  var LABELS = {
    dashboard: 'WCM Connect dashboard',
    tabs: 'WCM Connect sections',
    medications: 'WCM Connect medications',
    appointments: 'WCM Connect appointment scheduling'
  };

  var instances = [];
  var partialRequest = null;

  function loadPartial() {
    if (!partialRequest) {
      partialRequest = global.fetch(PARTIAL_URL).then(function (response) {
        if (!response.ok) throw new Error('wcm prototype partial: ' + response.status);
        return response.text();
      });
    }
    return partialRequest;
  }

  function prefersReduce() {
    return !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ------------------------------------------------------------------ */
  /* One prototype instance                                              */
  /* ------------------------------------------------------------------ */

  function mount(root, options) {
    var opts = options || {};
    var interactive = opts.interactive !== false;
    var GUTTER = opts.gutter || 40;

    var PHONE_W = 390;
    var PHONE_H = 844;
    var MIN_SCALE = 0.12;
    var SAFETY = 900;

    var live = root.querySelector('[data-wp-live]');
    var labelText = root.querySelector('[data-wp-label]');
    var phone = root.querySelector('.wp__phone');
    var tapEl = root.querySelector('[data-wp-tap]');
    var stage = root.querySelector('.wp__stage') || root;

    var screens = {};
    Array.prototype.forEach.call(root.querySelectorAll('[data-wp-screen]'), function (el) {
      screens[el.getAttribute('data-wp-screen')] = el;
      el.tabIndex = -1;
    });
    if (!screens.dashboard) return null;

    var current = 'dashboard';
    var currentTab = 'medications';
    var busy = false;
    var teardown = [];

    var tabsEl = root.querySelector('[data-wp-tabs]');
    var tabBtns = tabsEl
      ? Array.prototype.slice.call(tabsEl.querySelectorAll('[data-wp-tab]'))
      : [];
    var tabPanels = {
      medications: root.querySelector('[data-wp-panel="medications"]'),
      appointments: root.querySelector('[data-wp-panel="appointments"]')
    };

    function on(target, type, handler, config) {
      target.addEventListener(type, handler, config);
      teardown.push(function () {
        target.removeEventListener(type, handler, config);
      });
    }

    function fit() {
      var w = stage.clientWidth - GUTTER;
      var h = stage.clientHeight - GUTTER;
      if (w <= 0 || h <= 0) return;
      var scale = Math.min(h / PHONE_H, w / PHONE_W);
      root.style.setProperty('--wp-scale', Math.min(Math.max(scale, MIN_SCALE), 1).toFixed(4));
    }

    if (global.ResizeObserver) {
      var ro = new ResizeObserver(fit);
      ro.observe(stage);
      teardown.push(function () { ro.disconnect(); });
    } else {
      on(global, 'resize', fit);
    }

    function announce(text) {
      if (!live) return;
      live.textContent = '';
      live.textContent = text;
    }

    function hotOn(screenName, go) {
      var screen = screens[screenName];
      if (!screen) return null;
      return screen.querySelector('[data-wp-go="' + go + '"]');
    }

    function setTab(name, force) {
      if ((name !== 'medications' && name !== 'appointments') || (name === currentTab && !force)) {
        return;
      }
      currentTab = name;
      if (tabsEl) tabsEl.setAttribute('data-tab', name);

      tabBtns.forEach(function (btn) {
        var selected = btn.getAttribute('data-wp-tab') === name;
        btn.setAttribute('aria-selected', selected ? 'true' : 'false');
        btn.tabIndex = selected && interactive ? 0 : -1;
      });

      Object.keys(tabPanels).forEach(function (key) {
        var panel = tabPanels[key];
        if (!panel) return;
        var selected = key === name;
        panel.classList.toggle('is-active', selected);
        panel.hidden = !selected;
      });

      if (!force) announce(LABELS[name] || name);
    }

    function navigate(next) {
      if (busy || next === current || !screens[next]) return;
      var from = screens[current];
      var to = screens[next];
      busy = true;

      to.hidden = false;
      to.removeAttribute('inert');
      from.setAttribute('inert', '');
      to.classList.add('is-active');
      from.classList.add('is-exit-home');

      var timer = global.setTimeout(finish, SAFETY);
      from.addEventListener('animationend', onEnd);

      function onEnd(event) {
        if (event.target === from) finish();
      }

      function finish() {
        global.clearTimeout(timer);
        from.removeEventListener('animationend', onEnd);
        from.classList.remove('is-exit-home', 'is-active');
        from.hidden = true;
        current = next;
        busy = false;
        announce(next === 'tabs' ? (LABELS[currentTab] || LABELS.tabs) : (LABELS[next] || next));
      }
    }

    function openTabs(tabName) {
      setTab(tabName, current !== 'tabs');
      if (current !== 'tabs') navigate('tabs');
    }

    function toDashboard() {
      Object.keys(screens).forEach(function (name) {
        var screen = screens[name];
        screen.classList.remove('is-exit-home');
        var isHome = name === 'dashboard';
        screen.hidden = !isHome;
        screen.classList.toggle('is-active', isHome);
        if (isHome) screen.removeAttribute('inert');
        else screen.setAttribute('inert', '');
      });
      setTab('medications', true);
      busy = false;
      current = 'dashboard';
    }

    function showTap(target) {
      if (!tapEl || !phone || !target) return;
      var phoneRect = phone.getBoundingClientRect();
      var targetRect = target.getBoundingClientRect();
      if (!targetRect.width || !phoneRect.width) return;
      var scale = phoneRect.width / PHONE_W;
      tapEl.style.left = (targetRect.left + targetRect.width / 2 - phoneRect.left) / scale + 'px';
      tapEl.style.top = (targetRect.top + targetRect.height / 2 - phoneRect.top) / scale + 'px';
      tapEl.classList.remove('is-on');
      void tapEl.offsetWidth;
      tapEl.classList.add('is-on');
    }

    function hideTap() {
      if (tapEl) tapEl.classList.remove('is-on');
    }

    function tabBtn(name) {
      return tabsEl ? tabsEl.querySelector('[data-wp-tab="' + name + '"]') : null;
    }

    /* ---------- self-running demo ----------
       Open the tab shell from the dashboard, switch the fixed tabs
       in place, then Home back to the dashboard. */

    var STEPS = [
      { wait: 2100 },
      { tap: function () { return hotOn('dashboard', 'medications'); }, run: function () { openTabs('medications'); }, wait: 2800 },
      { tap: function () { return tabBtn('appointments'); }, run: function () { setTab('appointments'); }, wait: 2800 },
      { tap: function () { return hotOn('tabs', 'dashboard'); }, run: function () { navigate('dashboard'); }, wait: 1600 }
    ];

    var autoTimer = null;
    var autoStep = 0;
    var autoRunning = false;
    var inView = false;
    var reduced = prefersReduce();

    function clearAutoTimer() {
      if (autoTimer === null) return;
      global.clearTimeout(autoTimer);
      autoTimer = null;
    }

    function advance() {
      autoTimer = null;
      if (!autoRunning) return;
      if (busy) {
        autoTimer = global.setTimeout(advance, RETRY);
        return;
      }

      var step = STEPS[autoStep];
      autoStep = (autoStep + 1) % STEPS.length;

      var tapTarget = step.tap ? step.tap() : null;
      if (!tapTarget) {
        if (step.run) step.run();
        autoTimer = global.setTimeout(advance, step.wait);
        return;
      }

      showTap(tapTarget);
      autoTimer = global.setTimeout(function () {
        autoTimer = null;
        if (!autoRunning) return;
        if (step.run) step.run();
        autoTimer = global.setTimeout(advance, step.wait);
      }, TAP_LEAD);
    }

    function startAuto() {
      if (autoRunning || reduced) return;
      autoRunning = true;
      autoStep = 0;
      root.setAttribute('data-wp-mode', 'auto');
      if (live) live.setAttribute('aria-live', 'off');
      autoTimer = global.setTimeout(advance, 600);
    }

    function stopAuto() {
      autoRunning = false;
      clearAutoTimer();
      hideTap();
    }

    if (interactive) {
      on(root, 'click', function (event) {
        var target = event.target && event.target.closest;
        if (!target) return;

        var tabTarget = event.target.closest('[data-wp-tab]');
        if (tabTarget) {
          var tab = tabTarget.getAttribute('data-wp-tab');
          if (tab === 'medications' || tab === 'appointments') {
            setTab(tab);
            if (autoRunning) {
              autoStep = 0;
              clearAutoTimer();
              autoTimer = global.setTimeout(advance, 2800);
            }
          }
          return;
        }

        var goBtn = event.target.closest('[data-wp-go]');
        if (!goBtn || busy) return;
        var next = goBtn.getAttribute('data-wp-go');
        if (next === 'dashboard') {
          if (current === 'dashboard') return;
          navigate('dashboard');
        } else if (next === 'medications' || next === 'appointments') {
          openTabs(next);
        } else {
          return;
        }
        if (autoRunning) {
          autoStep = 0;
          clearAutoTimer();
          autoTimer = global.setTimeout(advance, 2800);
        }
      });
    }

    on(document, 'visibilitychange', function () {
      if (document.hidden) stopAuto();
      else if (inView && !reduced) startAuto();
    });

    Object.keys(screens).forEach(function (name) {
      if (name !== 'dashboard') screens[name].setAttribute('inert', '');
    });
    setTab('medications', true);
    root.setAttribute('data-wp-mode', reduced ? 'manual' : 'auto');
    if (labelText) labelText.textContent = reduced ? 'Dashboard' : 'Auto-playing';
    fit();

    function enter() {
      if (inView) return;
      inView = true;
      if (!reduced) startAuto();
    }

    function leave() {
      if (!inView) return;
      inView = false;
      stopAuto();
      toDashboard();
    }

    if (global.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) enter();
          else leave();
        });
      }, { threshold: 0.35 });
      io.observe(root);
      teardown.push(function () { io.disconnect(); });
    } else {
      enter();
    }

    return {
      root: root,
      destroy: function () {
        stopAuto();
        teardown.forEach(function (off) { off(); });
        teardown.length = 0;
      }
    };
  }

  /* ------------------------------------------------------------------ */
  /* Embedding                                                           */
  /* ------------------------------------------------------------------ */

  function deactivateControls(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll('button'), function (btn) {
      var span = document.createElement('span');
      Array.prototype.forEach.call(btn.attributes, function (attr) {
        if (attr.name === 'type' || attr.name === 'disabled') return;
        span.setAttribute(attr.name, attr.value);
      });
      while (btn.firstChild) span.appendChild(btn.firstChild);
      btn.parentNode.replaceChild(span, btn);
    });
  }

  function build(host, variant, html) {
    var staging = document.createElement('div');
    staging.innerHTML = html;

    var widget = staging.querySelector('[data-wp]');
    if (!widget) return null;

    if (variant.decorative) {
      widget.classList.add('wp--showcase');
      widget.setAttribute('aria-hidden', 'true');
      deactivateControls(widget);
    }

    host.appendChild(widget);
    Array.prototype.forEach.call(host.querySelectorAll('[data-wcm-fallback]'), function (el) {
      el.remove();
    });

    return widget;
  }

  function embed(host) {
    var name = host.getAttribute('data-wcm-embed');
    var variant = VARIANTS[name] || VARIANTS.full;

    if (variant.decorative && prefersReduce()) return;

    host.setAttribute('data-wcm-mounted', 'pending');

    loadPartial().then(function (html) {
      if (!document.contains(host)) return;
      var widget = build(host, variant, html);
      if (!widget) return;

      var instance = mount(widget, variant);
      if (!instance) return;
      instance.host = host;
      instances.push(instance);
      host.setAttribute('data-wcm-mounted', 'true');
    }).catch(function () {
      host.removeAttribute('data-wcm-mounted');
    });
  }

  function init() {
    instances = instances.filter(function (instance) {
      if (document.contains(instance.root)) return true;
      instance.destroy();
      return false;
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-wcm-embed]'), function (host) {
      if (host.hasAttribute('data-wcm-mounted')) return;
      embed(host);
    });
  }

  global.WcmPrototype = { init: init, mount: mount };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
