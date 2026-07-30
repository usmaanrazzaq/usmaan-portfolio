/* Rented interactive prototype — screen navigation, entrance choreography,
   and account tabs for the device embedded in the case study. */

(function () {
  'use strict';

  var root = document.querySelector('[data-rp]');
  if (!root) return;

  var PHONE_W = 390;
  var PHONE_H = 844;
  var GUTTER = 40;
  var SAFETY = 900;

  var live = root.querySelector('[data-rp-live]');
  var resetBtn = root.querySelector('[data-rp-reset]');
  var queryText = root.querySelector('[data-rp-query]');
  var prodScroll = root.querySelector('.rp-prod__scroll');
  var acctScroll = root.querySelector('.rp-acct__scroll');

  var screens = {};
  Array.prototype.forEach.call(root.querySelectorAll('[data-rp-screen]'), function (el) {
    screens[el.getAttribute('data-rp-screen')] = el;
    el.tabIndex = -1;
  });
  if (!screens.home) return;

  var LABELS = {
    home: 'Home screen',
    product: 'Painting equipment search results',
    account: 'John Smith account profile'
  };

  var current = 'home';
  var busy = false;
  var untouched = true;

  /* ---------- fit the 390x844 device to the container ---------- */

  function fit() {
    var w = root.clientWidth - GUTTER;
    var h = root.clientHeight - GUTTER;
    if (w <= 0 || h <= 0) return;
    var scale = Math.min(h / PHONE_H, w / PHONE_W);
    root.style.setProperty('--rp-scale', Math.min(Math.max(scale, 0.3), 1).toFixed(4));
  }

  if (window.ResizeObserver) {
    new ResizeObserver(fit).observe(root);
  } else {
    window.addEventListener('resize', fit);
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
    if (live) live.textContent = message;
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
    window.setTimeout(function () {
      apply();
      queryText.classList.remove('is-swapping');
    }, 170);
  }

  function markTouched() {
    if (!untouched) return;
    untouched = false;
    root.classList.remove('is-untouched');
  }

  /* ---------- account tabs ---------- */

  var tabsEl = root.querySelector('[data-rp-tabs]');
  var tabBtns = tabsEl ? Array.prototype.slice.call(tabsEl.querySelectorAll('.rp-tabs__btn')) : [];
  var panels = tabBtns.map(function (btn) {
    return document.getElementById(btn.getAttribute('aria-controls'));
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
      btn.tabIndex = selected ? 0 : -1;

      var panel = panels[n];
      if (!panel) return;
      panel.hidden = !selected;
      if (selected) prime(panel);
    });

    if (!force) announce(tabBtns[index].textContent.trim() + ' tab');
  }

  if (tabsEl) {
    tabsEl.addEventListener('click', function (event) {
      var btn = event.target.closest('.rp-tabs__btn');
      if (!btn) return;
      markTouched();
      setTab(tabBtns.indexOf(btn));
    });

    tabsEl.addEventListener('keydown', function (event) {
      var from = tabBtns.indexOf(document.activeElement);
      if (from < 0) return;

      var to = -1;
      if (event.key === 'ArrowRight') to = (from + 1) % tabBtns.length;
      else if (event.key === 'ArrowLeft') to = (from - 1 + tabBtns.length) % tabBtns.length;
      else if (event.key === 'Home') to = 0;
      else if (event.key === 'End') to = tabBtns.length - 1;
      if (to < 0) return;

      event.preventDefault();
      markTouched();
      setTab(to);
      tabBtns[to].focus();
    });
  }

  /* ---------- navigation ---------- */

  function syncChrome() {
    if (resetBtn) resetBtn.hidden = current === 'home';
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

    var timer = window.setTimeout(finish, SAFETY);
    to.addEventListener('animationend', onEnd);

    function onEnd(event) {
      if (event.target === to) finish();
    }

    function finish() {
      window.clearTimeout(timer);
      to.removeEventListener('animationend', onEnd);
      to.classList.remove(enterClass);
      from.classList.remove(exitClass, 'is-active');
      from.hidden = true;
      current = next;
      busy = false;
      syncChrome();
      to.focus({ preventScroll: true });
      announce(LABELS[next]);
    }
  }

  function reset(silent) {
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
    prime(screens.home);
    if (!silent) announce('Reset to the home screen');
  }

  root.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.closest) return;

    if (target.closest('[data-rp-reset]')) {
      markTouched();
      reset(false);
      return;
    }

    if (target.closest('[data-rp-back]')) {
      markTouched();
      setQuery('', true);
      navigate('home', true);
      return;
    }

    var goBtn = target.closest('[data-rp-go]');
    if (!goBtn) return;
    markTouched();

    var destination = goBtn.getAttribute('data-rp-go');
    if (destination === 'product') {
      // The tapped suggestion drops into the search field before the push.
      setQuery(goBtn.textContent.trim());
      window.setTimeout(function () {
        navigate('product', false);
      }, 190);
    } else {
      navigate(destination, false);
    }
  });

  /* ---------- lifecycle ---------- */

  screens.home.classList.add('is-intro');
  root.classList.add('is-untouched');
  Object.keys(screens).forEach(function (name) {
    if (name !== 'home') screens[name].setAttribute('inert', '');
  });
  setTab(0, true);
  syncChrome();
  fit();

  if (window.IntersectionObserver) {
    var seen = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          seen = true;
          if (current === 'home') prime(screens.home);
        } else if (seen && current !== 'home') {
          reset(true);
        }
      });
    }, { threshold: 0.35 }).observe(root);
  } else {
    prime(screens.home);
  }
})();
