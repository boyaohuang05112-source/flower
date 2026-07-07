(function () {
  'use strict';

  const WHITE_BUTTERFLY = `<svg viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg" class="butterfly-svg" aria-hidden="true">
    <path d="M12 10 Q6 4 2 8 Q6 10 12 10" fill="#FAF7F2" opacity="0.95"/>
    <path d="M12 10 Q18 4 22 8 Q18 10 12 10" fill="#F0EDE6" opacity="0.9"/>
    <path d="M12 10 Q6 14 3 12 Q7 11 12 10" fill="#FFFFFF" opacity="0.85"/>
    <path d="M12 10 Q18 14 21 12 Q17 11 12 10" fill="#F5F2EA" opacity="0.9"/>
    <ellipse cx="12" cy="10" rx="1" ry="4.5" fill="#8A8078" opacity="0.5"/>
  </svg>`;

  const BF_W = 58;
  const BF_H = 50;

  let container, trackWidth, butterfly, waypoints, wpIndex;
  let rafId = null;
  let phase = 'travel';
  let t0 = 0;
  let from, to;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function pctToPx(wp) {
    const parent = container?.parentElement;
    const h = parent?.offsetHeight || window.innerHeight || 900;
    return {
      x: (wp.x / 100) * trackWidth - BF_W / 2,
      y: (wp.y / 100) * h - BF_H / 2,
    };
  }

  function alignToGrassSpot(grassId) {
    const spot = document.querySelector(`[data-grass-id="${grassId}"]`);
    if (!spot || !container) return null;
    const layerRect = container.getBoundingClientRect();
    const spotRect = spot.getBoundingClientRect();
    return {
      x: spotRect.left + spotRect.width / 2 - layerRect.left - BF_W / 2,
      y: spotRect.top + spotRect.height / 2 - layerRect.top - BF_H / 2,
    };
  }

  function resolvePos(wp) {
    if (wp.kind === 'hint' && wp.grassId) {
      return alignToGrassSpot(wp.grassId) || pctToPx(wp);
    }
    return pctToPx(wp);
  }

  function setButterflyPos(pos) {
    if (!butterfly || !pos) return;
    butterfly.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  }

  function buildWaypoints(act) {
    const wps = [];
    const grass = (act.grassSpots || []).filter(
      (g) => !window.Collection.picked.has(g.sunflowerId)
    );

    if (act.id === 'entrance') {
      wps.push({ x: 8, y: 72, pauseMs: 1800, kind: 'patrol' });
      grass.forEach((g, i) => {
        wps.push({
          x: g.x,
          y: g.y,
          pauseMs: 5500,
          kind: 'hint',
          grassId: g.instanceId,
        });
        if (i < grass.length - 1) {
          const next = grass[i + 1];
          wps.push({
            x: (g.x + next.x) / 2,
            y: Math.min(g.y, next.y) - 8,
            pauseMs: 1600,
            kind: 'patrol',
          });
        }
      });
      return wps;
    }

    if (act.id === 'arthur-seat') {
      wps.push(
        { x: 12, y: 78, pauseMs: 2400, kind: 'patrol' },
        { x: 38, y: 72, pauseMs: 2800, kind: 'patrol' },
        { x: 62, y: 76, pauseMs: 2200, kind: 'patrol' },
        { x: 84, y: 70, pauseMs: 2600, kind: 'patrol' },
        { x: 50, y: 82, pauseMs: 2000, kind: 'patrol' }
      );
      return wps;
    }

    (act.wildFlowers || []).forEach((f) => {
      wps.push({ x: f.x, y: f.y - 7, pauseMs: 2000, kind: 'flower' });
    });
    grass.forEach((g) => {
      wps.push({
        x: g.x,
        y: g.y,
        pauseMs: 5000,
        kind: 'hint',
        grassId: g.instanceId,
      });
    });
    return wps;
  }

  function onHintPause(wp) {
    const spot = document.querySelector(`[data-grass-id="${wp.grassId}"]`);
    if (!spot) return;
    spot.classList.add('has-butterfly-hint', 'butterfly-hinted');
    wp._hintSpot = spot;
    setButterflyPos(alignToGrassSpot(wp.grassId));
  }

  function onHintEnd(wp) {
    wp._hintSpot?.classList.remove('has-butterfly-hint');
    wp._hintSpot = null;
  }

  function tick(now) {
    if (!butterfly || !waypoints.length) return;
    const elapsed = now - t0;

    if (phase === 'pause') {
      butterfly.classList.toggle('is-resting', true);
      if (to.kind === 'hint') {
        setButterflyPos(alignToGrassSpot(to.grassId));
      }
      if (to.kind === 'hint' && !to._hintTriggered) {
        to._hintTriggered = true;
        onHintPause(to);
      }
      if (elapsed >= to.pauseMs) {
        if (to.kind === 'hint') {
          onHintEnd(to);
          to._hintTriggered = false;
        }
        butterfly.classList.remove('is-resting');
        wpIndex = (wpIndex + 1) % waypoints.length;
        from = waypoints[wpIndex];
        to = waypoints[(wpIndex + 1) % waypoints.length];
        phase = 'travel';
        t0 = now;
      }
      return;
    }

    const travelMs = to.kind === 'hint' ? 3200 : to.kind === 'patrol' ? 2600 : 3400;
    const progress = Math.min(1, elapsed / travelMs);
    const e = easeInOut(progress);
    const a = resolvePos(from);
    const b = resolvePos(to);

    let ox = 0; let oy = 0;
    if (to.kind !== 'hint' && progress > 0.2 && progress < 0.9) {
      oy = Math.sin(progress * Math.PI * 3) * 4;
    }

    setButterflyPos({
      x: lerp(a.x, b.x, e) + ox,
      y: lerp(a.y, b.y, e) + oy,
    });

    if (progress >= 1) {
      phase = 'pause';
      t0 = now;
      if (to.kind === 'hint') {
        setButterflyPos(alignToGrassSpot(to.grassId));
      } else {
        setButterflyPos(b);
      }
    }
  }

  function loop(now) {
    tick(now);
    rafId = requestAnimationFrame(loop);
  }

  function init(sectionEl, act) {
    container = sectionEl?.querySelector('.butterfly-layer') || sectionEl;
    if (!container || !act) return;

    trackWidth = sectionEl.offsetWidth || window.innerWidth;
    container.innerHTML = '';

    waypoints = buildWaypoints(act);
    if (!waypoints.length) return;

    wpIndex = 0;
    from = waypoints[0];
    to = waypoints[1] || waypoints[0];
    phase = 'travel';
    t0 = performance.now();

    butterfly = document.createElement('div');
    butterfly.className = 'butterfly butterfly-white';
    butterfly.innerHTML = WHITE_BUTTERFLY;
    container.appendChild(butterfly);

    requestAnimationFrame(() => {
      setButterflyPos(resolvePos(from));
    });

    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    butterfly = null;
    waypoints = [];
  }

  window.Butterflies = { init, destroy };
})();
