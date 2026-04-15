/**
 * Interactive Ideation Board — view-only pan/zoom controller.
 * Initializes any [data-ideation-board] on the page.
 */
(function () {
    'use strict';

    const MIN_SCALE = 0.4;
    const MAX_SCALE = 2.5;
    const ZOOM_STEP = 1.2;
    const PAN_KEY_STEP = 40;

    function clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }

    function initBoard(board) {
        const canvas = board.querySelector('.ideation-canvas');
        if (!canvas) return;

        // Compute a "natural" canvas extent from children so we can fit-to-screen
        // and clamp panning sensibly.
        let contentW = 0;
        let contentH = 0;
        board.querySelectorAll('.ideation-sticky, .ideation-cluster, .ideation-image')
            .forEach((el) => {
                const x = parseFloat(el.style.getPropertyValue('--x')) || 0;
                const y = parseFloat(el.style.getPropertyValue('--y')) || 0;
                const w = parseFloat(el.style.getPropertyValue('--w')) || 160;
                const h = parseFloat(el.style.getPropertyValue('--h')) || 160;
                contentW = Math.max(contentW, x + w);
                contentH = Math.max(contentH, y + h);
            });
        contentW = contentW || 1200;
        contentH = contentH || 800;

        const state = { x: 0, y: 0, k: 1 };

        function apply() {
            canvas.style.transform =
                `translate(${state.x}px, ${state.y}px) scale(${state.k})`;
        }

        function fit() {
            const rect = board.getBoundingClientRect();
            const padding = 24;
            const k = Math.min(
                (rect.width - padding * 2) / contentW,
                (rect.height - padding * 2) / contentH,
                1
            );
            state.k = clamp(k, MIN_SCALE, MAX_SCALE);
            state.x = (rect.width - contentW * state.k) / 2;
            state.y = (rect.height - contentH * state.k) / 2;
            apply();
        }

        function clampPan() {
            const rect = board.getBoundingClientRect();
            const scaledW = contentW * state.k;
            const scaledH = contentH * state.k;
            // Allow edges to pan to the viewport center (soft clamp)
            const minX = rect.width / 2 - scaledW;
            const maxX = rect.width / 2;
            const minY = rect.height / 2 - scaledH;
            const maxY = rect.height / 2;
            state.x = clamp(state.x, minX, maxX);
            state.y = clamp(state.y, minY, maxY);
        }

        function zoomAt(factor, cx, cy) {
            const rect = board.getBoundingClientRect();
            const px = cx - rect.left;
            const py = cy - rect.top;
            const newK = clamp(state.k * factor, MIN_SCALE, MAX_SCALE);
            const ratio = newK / state.k;
            state.x = px - (px - state.x) * ratio;
            state.y = py - (py - state.y) * ratio;
            state.k = newK;
            clampPan();
            apply();
        }

        function markInteracted() {
            board.classList.add('has-interacted');
        }

        // Pointer-based pan + pinch
        const pointers = new Map();
        let panStart = null;
        let pinchStart = null;

        function onPointerDown(e) {
            // Don't hijack clicks on the controls or hint
            if (e.target.closest('.ideation-board__controls, .ideation-board__hint')) {
                return;
            }
            board.setPointerCapture(e.pointerId);
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            markInteracted();

            if (pointers.size === 1) {
                panStart = { x: e.clientX, y: e.clientY, sx: state.x, sy: state.y };
                board.classList.add('is-panning');
            } else if (pointers.size === 2) {
                const pts = [...pointers.values()];
                const dx = pts[0].x - pts[1].x;
                const dy = pts[0].y - pts[1].y;
                pinchStart = {
                    dist: Math.hypot(dx, dy),
                    k: state.k,
                    cx: (pts[0].x + pts[1].x) / 2,
                    cy: (pts[0].y + pts[1].y) / 2,
                };
                panStart = null;
                board.classList.remove('is-panning');
                board.classList.add('is-pinching');
            }
        }

        function onPointerMove(e) {
            if (!pointers.has(e.pointerId)) return;
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

            if (pointers.size === 1 && panStart) {
                state.x = panStart.sx + (e.clientX - panStart.x);
                state.y = panStart.sy + (e.clientY - panStart.y);
                clampPan();
                apply();
            } else if (pointers.size === 2 && pinchStart) {
                const pts = [...pointers.values()];
                const dx = pts[0].x - pts[1].x;
                const dy = pts[0].y - pts[1].y;
                const dist = Math.hypot(dx, dy);
                const factor = (dist / pinchStart.dist) * (pinchStart.k / state.k);
                zoomAt(factor, pinchStart.cx, pinchStart.cy);
            }
        }

        function onPointerUp(e) {
            pointers.delete(e.pointerId);
            if (pointers.size < 2) {
                pinchStart = null;
                board.classList.remove('is-pinching');
            }
            if (pointers.size === 0) {
                panStart = null;
                board.classList.remove('is-panning');
            } else if (pointers.size === 1) {
                const only = [...pointers.values()][0];
                panStart = { x: only.x, y: only.y, sx: state.x, sy: state.y };
            }
        }

        board.addEventListener('pointerdown', onPointerDown);
        board.addEventListener('pointermove', onPointerMove);
        board.addEventListener('pointerup', onPointerUp);
        board.addEventListener('pointercancel', onPointerUp);

        // Wheel zoom (and trackpad pan when shift not held)
        board.addEventListener('wheel', (e) => {
            e.preventDefault();
            markInteracted();
            if (e.ctrlKey || e.metaKey) {
                const factor = Math.pow(1.0025, -e.deltaY);
                zoomAt(factor, e.clientX, e.clientY);
            } else if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.shiftKey) {
                // Standard wheel → zoom toward cursor
                const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
                zoomAt(factor, e.clientX, e.clientY);
            } else {
                // Trackpad two-finger pan
                state.x -= e.deltaX;
                state.y -= e.deltaY;
                clampPan();
                apply();
            }
        }, { passive: false });

        // Keyboard
        board.addEventListener('keydown', (e) => {
            const rect = board.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            switch (e.key) {
                case '+': case '=':
                    e.preventDefault(); markInteracted();
                    zoomAt(ZOOM_STEP, cx, cy); break;
                case '-': case '_':
                    e.preventDefault(); markInteracted();
                    zoomAt(1 / ZOOM_STEP, cx, cy); break;
                case '0':
                    e.preventDefault(); markInteracted();
                    fit(); break;
                case 'ArrowUp':
                    e.preventDefault(); markInteracted();
                    state.y += PAN_KEY_STEP; clampPan(); apply(); break;
                case 'ArrowDown':
                    e.preventDefault(); markInteracted();
                    state.y -= PAN_KEY_STEP; clampPan(); apply(); break;
                case 'ArrowLeft':
                    e.preventDefault(); markInteracted();
                    state.x += PAN_KEY_STEP; clampPan(); apply(); break;
                case 'ArrowRight':
                    e.preventDefault(); markInteracted();
                    state.x -= PAN_KEY_STEP; clampPan(); apply(); break;
            }
        });

        // Control buttons
        board.querySelector('[data-zoom-in]')?.addEventListener('click', () => {
            const rect = board.getBoundingClientRect();
            markInteracted();
            zoomAt(ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
        board.querySelector('[data-zoom-out]')?.addEventListener('click', () => {
            const rect = board.getBoundingClientRect();
            markInteracted();
            zoomAt(1 / ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
        board.querySelector('[data-zoom-reset]')?.addEventListener('click', () => {
            markInteracted();
            fit();
        });

        // Resize handling
        const ro = new ResizeObserver(() => fit());
        ro.observe(board);

        // Initial fit (after layout)
        requestAnimationFrame(fit);

        // GSAP reveal if available and not reduced motion
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reducedMotion && window.gsap && window.ScrollTrigger) {
            window.gsap.from(board, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: board,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });
        }
    }

    function initAll() {
        document.querySelectorAll('[data-ideation-board]').forEach(initBoard);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
