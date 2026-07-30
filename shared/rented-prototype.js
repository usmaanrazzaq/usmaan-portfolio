/* Rented interactive prototype — screen navigation, entrance choreography,
   account tabs, and the self-running demo.

   Two hosts embed it, both declared with data-rp-embed:
     full      the case study, interactive, with label and reset chrome
     showcase  the homepage case card, a decorative demo inside a link

   The demo plays on a loop while the prototype is on screen. In the full
   variant the first touch hands over; the showcase variant never does. */

(function (global) {
  'use strict';

  var PARTIAL_URL = '/shared/rented-prototype.html';

  var VARIANTS = {
    full: { interactive: true, gutter: 40 },
    showcase: { interactive: false, gutter: 28, decorative: true }
  };

  var instances = [];
  var partialRequest = null;

  function loadPartial() {
    if (!partialRequest) {
      partialRequest = global.fetch(PARTIAL_URL).then(function (response) {
        if (!response.ok) throw new Error('rented prototype partial: ' + response.status);
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

    // Delay between a demo tap ripple and the action it stands for.
    var TAP_LEAD = 200;
    // How long to wait before retrying a demo step that landed mid-transition.
    var RETRY = 220;
    var LABEL_AUTO = 'Auto-playing \u2014 tap to try it';
    var LABEL_MANUAL = 'Interactive prototype';

    var live = root.querySelector('[data-rp-live]');
    var labelText = root.querySelector('[data-rp-label]');
    var resetBtn = root.querySelector('[data-rp-reset]');
    var queryText = root.querySelector('[data-rp-query]');
    var phone = root.querySelector('.rp__phone');
    var tapEl = root.querySelector('[data-rp-tap]');
    var prodScroll = root.querySelector('.rp-prod__scroll');
    var acctScroll = root.querySelector('.rp-acct__scroll');

    var screens = {};
    Array.prototype.forEach.call(root.querySelectorAll('[data-rp-screen]'), function (el) {
      screens[el.getAttribute('data-rp-screen')] = el;
      el.tabIndex = -1;
    });
    if (!screens.home) return null;

    var LABELS = {
      home: 'Home screen',
      product: 'Painting equipment search results',
      account: 'John Smith account profile'
    };

    var current = 'home';
    var busy = false;
    // Suppresses focus moves and announcements while the demo drives the
    // device. The showcase never hands over, so it stays quiet for good.
    var quiet = false;

    var teardown = [];

    function on(target, type, handler, config) {
      target.addEventListener(type, handler, config);
      teardown.push(function () {
        target.removeEventListener(type, handler, config);
      });
    }

    /* ---------- fit the 390x844 device to the host ---------- */

    function fit() {
      var w = root.clientWidth - GUTTER;
      var h = root.clientHeight - GUTTER;
      if (w <= 0 || h <= 0) return;
      var scale = Math.min(h / PHONE_H, w / PHONE_W);
      root.style.setProperty('--rp-scale', Math.min(Math.max(scale, MIN_SCALE), 1).toFixed(4));
    }

    if (global.ResizeObserver) {
      var ro = new ResizeObserver(fit);
      ro.observe(root);
      teardown.push(function () { ro.disconnect(); });
    } else {
      on(global, 'resize', fit);
    }

    /* ---------- helpers ---------- */

    // Snaps an element to its pre-animation state, then releases it so the
    // staggered child transitions run from the top.
    function prime(el) {
      if (!el) return;
      el.classList.add('is-intro');
      void el.offsetWidth;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          el.classList.remove('is-intro');
        });
      });
    }

    function announce(message) {
      if (!live || quiet) return;
      live.textContent = message;
    }

    // `fade` crossfades the swap so clearing the field during the pop back home
    // does not read as a glitch.
    function setQuery(text, fade) {
      if (!queryText) return;
      var next = text || 'Search for a product';
      if (queryText.textContent === next) return;

      function apply() {
        queryText.textContent = next;
        queryText.classList.toggle('is-filled', !!text);
      }

      if (!fade) {
        apply();
        return;
      }

      queryText.classList.add('is-swapping');
      global.setTimeout(function () {
        apply();
        queryText.classList.remove('is-swapping');
      }, 170);
    }

    /* ---------- account tabs ---------- */

    var tabsEl = root.querySelector('[data-rp-tabs]');
    var tabBtns = tabsEl ? Array.prototype.slice.call(tabsEl.querySelectorAll('.rp-tabs__btn')) : [];
    var panels = tabBtns.map(function (btn) {
      return root.querySelector('#' + btn.getAttribute('aria-controls'));
    });
    var tabIndex = 0;

    function setTab(index, force) {
      if (!tabsEl || (index === tabIndex && !force)) return;
      tabIndex = index;
      tabsEl.style.setProperty('--tab', String(index));
      tabsEl.setAttribute('data-tab', String(index));

      tabBtns.forEach(function (btn, n) {
        var selected = n === index;
        btn.setAttribute('aria-selected', selected ? 'true' : 'false');
        // The showcase sits inside a link, so it must contribute no tab stops.
        btn.tabIndex = selected && interactive ? 0 : -1;

        var panel = panels[n];
        if (!panel) return;
        panel.hidden = !selected;
        if (selected) prime(panel);
      });

      if (!force) announce(tabBtns[index].textContent.trim() + ' tab');
    }

    if (tabsEl && interactive) {
      on(tabsEl, 'click', function (event) {
        var btn = event.target.closest('.rp-tabs__btn');
        if (!btn) return;
        setTab(tabBtns.indexOf(btn));
      });

      on(tabsEl, 'keydown', function (event) {
        var from = tabBtns.indexOf(document.activeElement);
        if (from < 0) return;

        var to = -1;
        if (event.key === 'ArrowRight') to = (from + 1) % tabBtns.length;
        else if (event.key === 'ArrowLeft') to = (from - 1 + tabBtns.length) % tabBtns.length;
        else if (event.key === 'Home') to = 0;
        else if (event.key === 'End') to = tabBtns.length - 1;
        if (to < 0) return;

        event.preventDefault();
        setTab(to);
        tabBtns[to].focus();
      });
    }

    /* ---------- navigation ---------- */

    function syncChrome() {
      if (resetBtn) resetBtn.hidden = current === 'home' || autoRunning;
    }

    function navigate(next, back) {
      if (busy || next === current || !screens[next]) return;

      var from = screens[current];
      var to = screens[next];
      busy = true;

      to.hidden = false;
      to.removeAttribute('inert');
      from.setAttribute('inert', '');

      if (next === 'product') {
        if (prodScroll) prodScroll.scrollTop = 0;
        prime(to);
      } else if (next === 'account') {
        if (acctScroll) acctScroll.scrollTop = 0;
        prime(panels[tabIndex]);
      }

      var enterClass = back ? 'is-enter-back' : 'is-enter-fwd';
      var exitClass = back ? 'is-exit-back' : 'is-exit-fwd';
      to.classList.add('is-active', enterClass);
      from.classList.add(exitClass);

      var timer = global.setTimeout(finish, SAFETY);
      to.addEventListener('animationend', onEnd);

      function onEnd(event) {
        if (event.target === to) finish();
      }

      function finish() {
        global.clearTimeout(timer);
        to.removeEventListener('animationend', onEnd);
        to.classList.remove(enterClass);
        from.classList.remove(exitClass, 'is-active');
        from.hidden = true;
        current = next;
        busy = false;
        syncChrome();
        // Pulling focus while the demo runs itself would yank the page around.
        if (!quiet) to.focus({ preventScroll: true });
        announce(LABELS[next]);
      }
    }

    // Restores the device to a pristine home screen without replaying the
    // entrance, so callers can decide when the chips should stack in.
    function toHome() {
      Object.keys(screens).forEach(function (name) {
        var screen = screens[name];
        screen.classList.remove('is-enter-fwd', 'is-exit-fwd', 'is-enter-back', 'is-exit-back');
        var isHome = name === 'home';
        screen.hidden = !isHome;
        screen.classList.toggle('is-active', isHome);
        if (isHome) screen.removeAttribute('inert');
        else screen.setAttribute('inert', '');
      });

      busy = false;
      current = 'home';
      setQuery('');
      setTab(0, true);
      if (prodScroll) prodScroll.scrollTop = 0;
      if (acctScroll) acctScroll.scrollTop = 0;
      syncChrome();
    }

    function reset(silent) {
      toHome();
      prime(screens.home);
      if (!silent) announce('Reset to the home screen');
    }

    function openProduct(chip) {
      setQuery(chip.textContent.trim());
      global.setTimeout(function () {
        navigate('product', false);
      }, 190);
    }

    function goBackHome() {
      setQuery('', true);
      navigate('home', true);
    }

    if (interactive) {
      on(root, 'click', function (event) {
        var target = event.target;
        if (!target || !target.closest) return;

        if (target.closest('[data-rp-reset]')) {
          reset(false);
          return;
        }

        if (target.closest('[data-rp-back]')) {
          goBackHome();
          return;
        }

        var goBtn = target.closest('[data-rp-go]');
        if (!goBtn) return;

        var destination = goBtn.getAttribute('data-rp-go');
        if (destination === 'product') {
          // The tapped suggestion drops into the search field before the push.
          openProduct(goBtn);
        } else {
          navigate(destination, false);
        }
      });
    }

    /* ---------- self-running demo ---------- */

    var chipBtn = root.querySelector('[data-rp-go="product"]');
    var accountBtn = root.querySelector('[data-rp-go="account"]');
    var cancelBtn = root.querySelector('.rp-cancel');
    var acctBackBtn = screens.account ? screens.account.querySelector('[data-rp-back]') : null;

    var canDemo = !!(chipBtn && accountBtn && cancelBtn && acctBackBtn && tabBtns.length === 3);

    // Each entry optionally ripples a control, runs an action, then holds. The
    // chip tap is split in two so the label lands in the field before the push,
    // and so every wait remains a single cancellable link in the chain.
    var STEPS = !canDemo ? [] : [
      { run: function () { prime(screens.home); }, wait: 2100 },
      { tap: chipBtn, run: function () { setQuery(chipBtn.textContent.trim()); }, wait: 260 },
      { run: function () { navigate('product', false); }, wait: 3200 },
      { tap: cancelBtn, run: goBackHome, wait: 1200 },
      { tap: accountBtn, run: function () { navigate('account', false); }, wait: 2200 },
      { tap: tabBtns[1], run: function () { setTab(1); }, wait: 2000 },
      { tap: tabBtns[2], run: function () { setTab(2); }, wait: 2000 },
      { tap: tabBtns[0], run: function () { setTab(0); }, wait: 1500 },
      { tap: acctBackBtn, run: goBackHome, wait: 1500 }
    ];

    var autoTimer = null;
    var autoStep = 0;
    var autoRunning = false;
    var takenOver = false;
    var inView = false;

    function showTap(target) {
      if (!tapEl || !phone || !target) return;
      var phoneRect = phone.getBoundingClientRect();
      var targetRect = target.getBoundingClientRect();
      if (!targetRect.width || !phoneRect.width) return;

      // Client rects are post-scale; divide back into the device's own pixels.
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

    function clearAutoTimer() {
      if (autoTimer === null) return;
      global.clearTimeout(autoTimer);
      autoTimer = null;
    }

    function advance() {
      autoTimer = null;
      if (!autoRunning) return;

      // Never cut into a transition that is still playing.
      if (busy) {
        autoTimer = global.setTimeout(advance, RETRY);
        return;
      }

      var step = STEPS[autoStep];
      autoStep = (autoStep + 1) % STEPS.length;

      if (!step.tap) {
        if (step.run) step.run();
        autoTimer = global.setTimeout(advance, step.wait);
        return;
      }

      showTap(step.tap);
      autoTimer = global.setTimeout(function () {
        autoTimer = null;
        if (!autoRunning) return;
        step.run();
        autoTimer = global.setTimeout(advance, step.wait);
      }, TAP_LEAD);
    }

    function startAuto() {
      if (autoRunning || takenOver || !canDemo || prefersReduce()) return;
      autoRunning = true;
      quiet = true;
      autoStep = 0;
      toHome();
      setMode(true);
      autoTimer = global.setTimeout(advance, 600);
    }

    function stopAuto() {
      autoRunning = false;
      clearAutoTimer();
      hideTap();
      quiet = false;
      syncChrome();
    }

    function setMode(auto) {
      root.setAttribute('data-rp-mode', auto ? 'auto' : 'manual');
      if (labelText) labelText.textContent = auto ? LABEL_AUTO : LABEL_MANUAL;
      if (live) live.setAttribute('aria-live', auto ? 'off' : 'polite');
      // Without the demo to show what is tappable, flag the chip that
      // navigates. Never in the showcase, where nothing is tappable at all.
      root.classList.toggle('is-untouched', interactive && !auto && !takenOver);
    }

    function takeOver() {
      if (takenOver) return;
      takenOver = true;
      stopAuto();
      setMode(false);
    }

    if (interactive) {
      ['pointerdown', 'touchstart', 'keydown', 'focusin'].forEach(function (type) {
        on(root, type, takeOver, { capture: true, passive: true });
      });

      // Scoped to the device so scrolling the page past the host's empty
      // margin does not count as reaching for the prototype.
      if (phone) on(phone, 'wheel', takeOver, { passive: true });
    }

    on(document, 'visibilitychange', function () {
      if (document.hidden) stopAuto();
      else if (inView && !takenOver) startAuto();
    });

    /* ---------- lifecycle ---------- */

    screens.home.classList.add('is-intro');
    Object.keys(screens).forEach(function (name) {
      if (name !== 'home') screens[name].setAttribute('inert', '');
    });
    setTab(0, true);
    setMode(false);
    syncChrome();
    fit();

    function enter() {
      if (inView) return;
      inView = true;
      if (takenOver || !canDemo || prefersReduce()) {
        if (current === 'home') prime(screens.home);
        return;
      }
      startAuto();
    }

    function leave() {
      if (!inView) return;
      inView = false;
      stopAuto();
      // Scrolling away is the "exit" that puts the demo back in charge.
      takenOver = false;
      toHome();
      // Parked pre-entrance, so the chips stack in on the way back rather than
      // sitting visible for a beat and then snapping out.
      screens.home.classList.add('is-intro');
      setMode(false);
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

  // Interactive content cannot be nested inside a link, and the homepage card
  // is one. The showcase is inert anyway, so its controls become plain spans.
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

    var widget = staging.querySelector('[data-rp]');
    if (!widget) return null;

    if (variant.decorative) {
      widget.classList.add('rp--showcase');
      widget.setAttribute('aria-hidden', 'true');
      deactivateControls(widget);
    }

    host.appendChild(widget);
    // Only now is the replacement on screen, so the fallback can go without
    // ever leaving the host empty or changing its height.
    Array.prototype.forEach.call(host.querySelectorAll('[data-rp-fallback]'), function (el) {
      el.remove();
    });

    return widget;
  }

  function embed(host) {
    var name = host.getAttribute('data-rp-embed');
    var variant = VARIANTS[name] || VARIANTS.full;

    // A showcase with the demo switched off is a dead screenshot, and a worse
    // one than the image already sitting there.
    if (variant.decorative && prefersReduce()) return;

    host.setAttribute('data-rp-mounted', 'pending');

    loadPartial().then(function (html) {
      if (!document.contains(host)) return;
      var widget = build(host, variant, html);
      if (!widget) return;

      var instance = mount(widget, variant);
      if (!instance) return;
      instance.host = host;
      instances.push(instance);
      host.setAttribute('data-rp-mounted', 'true');
    }).catch(function () {
      // The fallback image is untouched on failure, so the host still looks
      // exactly like it did before.
      host.removeAttribute('data-rp-mounted');
    });
  }

  function init() {
    // Sweep instances whose host left the document, e.g. after an SPA swap.
    instances = instances.filter(function (instance) {
      if (document.contains(instance.root)) return true;
      instance.destroy();
      return false;
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-rp-embed]'), function (host) {
      if (host.hasAttribute('data-rp-mounted')) return;
      embed(host);
    });
  }

  global.RentedPrototype = { init: init, mount: mount };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
