(function () {
  'use strict';

  const DURATION = 6500;
  const PAUSE = 500;

  const loadingScreen = document.getElementById('loading-screen');
  const percentEl = document.getElementById('loading-percent');
  const flowerEl = document.getElementById('flower-growth');

  if (!loadingScreen || !flowerEl) return;

  const directAct = new URLSearchParams(location.search).get('act');
  if (directAct === '2' || directAct === '3' || directAct === '4') {
    function instantFinish() {
      percentEl.textContent = '100%';
      updateFlower(100);
      loadingScreen.classList.add('is-done');
      document.getElementById('welcome')?.classList.add('is-hidden');
      document.dispatchEvent(new CustomEvent('loadingComplete'));
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(instantFinish));
    } else {
      requestAnimationFrame(instantFinish);
    }
    return;
  }

  function ease(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function mapRange(p, a, b) {
    if (p <= a) return 0;
    if (p >= b) return 1;
    return ease((p - a) / (b - a));
  }

  function updateFlower(p) {
    flowerEl.style.setProperty('--seed-op', 1 - mapRange(p, 4, 12));
    flowerEl.style.setProperty('--stem-h', mapRange(p, 8, 38));
    flowerEl.style.setProperty('--leaf-l', mapRange(p, 28, 48));
    flowerEl.style.setProperty('--leaf-r', mapRange(p, 34, 54));
    flowerEl.style.setProperty('--bud', mapRange(p, 46, 58) * (1 - mapRange(p, 62, 72)));
    flowerEl.style.setProperty('--bloom', mapRange(p, 58, 72));
    for (let i = 0; i < 12; i++) {
      flowerEl.style.setProperty(`--petal-${i}`, mapRange(p, 55 + i * 2.2, 78 + i * 1.8));
    }
  }

  function finish() {
    const welcome = document.getElementById('welcome');

    if (welcome) {
      welcome.classList.remove('is-hidden');
      welcome.classList.add('is-visible', 'is-revealed');
    }

    document.dispatchEvent(new CustomEvent('loadingComplete'));

    requestAnimationFrame(() => {
      loadingScreen.classList.add('is-done');
    });
  }

  function run() {
    const start = performance.now();
    let last = -1;

    function frame(now) {
      const raw = Math.min((now - start) / DURATION, 1);
      const progress = ease(raw) * 100;
      const rounded = Math.round(progress);
      if (rounded !== last) {
        last = rounded;
        percentEl.textContent = `${last}%`;
      }
      updateFlower(progress);
      if (raw < 1) requestAnimationFrame(frame);
      else {
        percentEl.textContent = '100%';
        updateFlower(100);
        setTimeout(finish, PAUSE);
      }
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
