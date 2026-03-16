/**
 * Projects page: Additional Work / Side Projects tab switching with smooth fade.
 */
(function () {
  function initProjectsTabs() {
    const section = document.getElementById('projects');
    if (!section || !section.classList.contains('projects-tabs-section')) return;

    const tabs = section.querySelectorAll('.projects-tab');
    const panels = section.querySelectorAll('.projects-panel');

    if (tabs.length === 0 || panels.length === 0) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const targetId = this.getAttribute('aria-controls');
        const targetPanel = document.getElementById(targetId);
        const currentPanel = section.querySelector('.projects-panel.active');

        if (!targetPanel || targetPanel === currentPanel) return;

        // Update tab state
        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Fade: activate new panel (fades in), then fade out current panel on top
        targetPanel.classList.add('active');
        targetPanel.removeAttribute('aria-hidden');

        if (currentPanel) {
          currentPanel.classList.remove('active');
          currentPanel.classList.add('fading-out');
          currentPanel.setAttribute('aria-hidden', 'true');
          setTimeout(function () {
            currentPanel.classList.remove('fading-out');
          }, 420);
        }
      });

      tab.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        var idx = Array.prototype.indexOf.call(tabs, this);
        if (e.key === 'ArrowLeft') idx = Math.max(0, idx - 1);
        else idx = Math.min(tabs.length - 1, idx + 1);
        tabs[idx].focus();
        tabs[idx].click();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsTabs);
  } else {
    initProjectsTabs();
  }
})();
