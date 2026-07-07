(function () {
  'use strict';

  const P = window.Pastel;
  const MARKED_INDEX = 17;

  const ZONES = [
    { x: [0.06, 0.24], y: [0.1, 0.28] },
    { x: [0.5, 0.78], y: [0.08, 0.26] },
    { x: [0.28, 0.48], y: [0.14, 0.34] },
    { x: [0.1, 0.32], y: [0.4, 0.58] },
    { x: [0.42, 0.62], y: [0.36, 0.52] },
    { x: [0.7, 0.9], y: [0.44, 0.64] },
    { x: [0.18, 0.45], y: [0.68, 0.84] },
    { x: [0.58, 0.86], y: [0.72, 0.88] },
  ];

  let layer = null;

  function rand(i, salt, a, b) {
    const t = P?.seeded ? P.seeded(i, salt) : Math.random();
    return a + t * (b - a);
  }

  function init(sectionEl) {
    destroy();
    layer = sectionEl?.querySelector('.act3-firefly-layer');
    if (!layer) return;

    for (let i = 0; i < 34; i++) {
      const zone = ZONES[i % ZONES.length];
      const x = rand(i, 1, zone.x[0], zone.x[1]);
      const y = rand(i, 3, zone.y[0], zone.y[1]);
      const isMarked = i === MARKED_INDEX;
      const size = isMarked ? 7 : 3 + rand(i, 5, 0, 2.5);
      const twinkle = isMarked ? 2.2 : 2.8 + rand(i, 7, 0, 2.4);
      const drift = isMarked ? 9 : 7 + rand(i, 9, 0, 5);
      const delay = rand(i, 11, 0, 4);

      if (isMarked) {
        const slot = document.createElement('div');
        slot.className = 'act3-firefly-slot act3-firefly-slot-marked';
        slot.style.left = `${x * 100}%`;
        slot.style.top = `${y * 100}%`;
        slot.style.setProperty('--drift-x', `${rand(i, 13, -10, 10)}px`);
        slot.style.setProperty('--drift-y', `${rand(i, 15, -8, 6)}px`);
        slot.style.setProperty('--drift-dur', `${drift}s`);
        slot.style.animationDelay = `${delay * 0.7}s`;
        slot.innerHTML = `${window.Act3Halo?.html?.('sf-9') || ''}<span class="act3-firefly act3-firefly-marked" aria-hidden="true"></span>`;
        const ff = slot.querySelector('.act3-firefly');
        ff.style.setProperty('--twinkle-dur', `${twinkle}s`);
        ff.style.animationDelay = `${delay}s, 0s`;
        window.Act3Halo?.bindHalo?.(slot.querySelector('.act3-html-halo'));
        layer.appendChild(slot);
        continue;
      }

      const firefly = document.createElement('div');
      firefly.className = 'act3-firefly';
      firefly.style.left = `${x * 100}%`;
      firefly.style.top = `${y * 100}%`;
      firefly.style.width = `${size}px`;
      firefly.style.height = `${size}px`;
      firefly.style.setProperty('--twinkle-dur', `${twinkle}s`);
      firefly.style.setProperty('--drift-dur', `${drift}s`);
      firefly.style.setProperty('--drift-x', `${rand(i, 13, -14, 14)}px`);
      firefly.style.setProperty('--drift-y', `${rand(i, 15, -10, 8)}px`);
      firefly.style.animationDelay = `${delay}s, ${delay * 0.7}s`;
      layer.appendChild(firefly);
    }
  }

  function destroy() {
    if (layer) layer.innerHTML = '';
    layer = null;
  }

  window.Act3Fireflies = { init, destroy };
})();
