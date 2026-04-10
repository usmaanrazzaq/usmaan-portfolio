// ===== SHARED SCROLL ANIMATIONS =====
// Reusable scroll-triggered animations for case study pages.
// Requires GSAP core + ScrollTrigger to be loaded before this file.

function initScrollAnimations(options) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var defaults = {
    contentReveals: true,
    imageReveals: true,
    heroParallax: true,
    gridStagger: true
  };

  var config = {};
  for (var key in defaults) {
    config[key] = (options && key in options) ? options[key] : defaults[key];
  }

  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function() {

    // --- Content block reveals ---
    if (config.contentReveals) {
      gsap.utils.toArray('.content-block').forEach(function(block) {
        var children = block.querySelectorAll('.section-header, .section-question, .section-content, .section-text');
        if (!children.length) return;

        gsap.set(children, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: block,
          start: 'top 85%',
          once: true,
          onEnter: function() {
            gsap.to(children, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'expo.out',
              stagger: 0.12
            });
          }
        });
      });
    }

    // --- Image / wireframe display reveals ---
    if (config.imageReveals) {
      gsap.utils.toArray('.wireframe-display').forEach(function(display) {
        gsap.set(display, { opacity: 0, scale: 0.96 });

        ScrollTrigger.create({
          trigger: display,
          start: 'top 80%',
          once: true,
          onEnter: function() {
            gsap.to(display, {
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: 'expo.out'
            });
          }
        });
      });
    }

    // --- Hero parallax ---
    if (config.heroParallax) {
      var heroMedia = document.querySelector('.hero-video video, .hero-video img');
      if (heroMedia) {
        gsap.to(heroMedia, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: '.case-study-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }

    // --- Grid item stagger ---
    if (config.gridStagger) {
      // Match any grid container that holds multiple child items
      var gridSelectors = [
        '.wireframe-grid',
        '.display-grid',
        '.research-grid',
        '.logo-stack',
        '[class*="display-grid"]',
        '[class*="graphics-grid"]'
      ].join(', ');

      gsap.utils.toArray(gridSelectors).forEach(function(grid) {
        var items = grid.children;
        if (!items.length) return;

        gsap.set(items, { opacity: 0, y: 20 });

        ScrollTrigger.create({
          trigger: grid,
          start: 'top 80%',
          once: true,
          onEnter: function() {
            gsap.to(items, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'expo.out',
              stagger: 0.1
            });
          }
        });
      });
    }

    // Cleanup
    return function() {
      ScrollTrigger.getAll().forEach(function(t) { t.kill(); });
    };
  });
}
