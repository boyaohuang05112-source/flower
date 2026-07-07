(function () {
  'use strict';

  let layer = null;
  let act = null;
  let intervalId = null;
  let firstMeteorTriggered = false;

  function spawnMeteorVisual() {
    if (!layer) return;
    const top = 8 + Math.random() * 30;
    const meteor = document.createElement('div');
    meteor.className = 'act3-meteor act3-meteor-from-right';
    meteor.dataset.flowerId = 'sf-8';
    meteor.setAttribute('role', 'button');
    meteor.setAttribute('aria-label', '向日葵');
    meteor.style.top = `${top}%`;
    meteor.style.right = `${-4 + Math.random() * 4}%`;
    const haloHtml = window.Act3Halo?.html?.('sf-8') || '';
    meteor.innerHTML = `${haloHtml}<span class="act3-meteor-streak" aria-hidden="true"></span>`;
    const haloBtn = meteor.querySelector('.act3-html-halo');
    if (haloBtn) {
      haloBtn.style.left = '0';
      haloBtn.style.top = '50%';
      haloBtn.tabIndex = -1;
      window.Act3Halo?.bindHalo?.(haloBtn);
    }
    const flower = (window.SUNFLOWERS || []).find((s) => s.instanceId === 'sf-8');
    meteor.addEventListener('click', () => {
      if (meteor.classList.contains('is-picked')) return;
      if (window.Collection?.picked?.has('sf-8')) return;
      window.FlowerInteract?.openSunflowerCard?.(flower);
    });
    layer.appendChild(meteor);
    meteor.addEventListener('animationend', () => meteor.remove(), { once: true });
  }

  function spawnMeteor() {
    if (!firstMeteorTriggered) {
      firstMeteorTriggered = true;
      void (async () => {
        await window.Monologue?.waitUntilIdle?.();
        spawnMeteorVisual();
        if (act?.firstMeteorSequence) {
          await window.Monologue?.playFirstMeteorSequence?.(act.firstMeteorSequence);
        }
      })();
      return;
    }
    spawnMeteorVisual();
  }

  function init(sectionEl, actData) {
    destroy();
    if (actData?.id !== 'arthur-seat') return;

    act = actData;
    layer = sectionEl?.querySelector('.act3-meteor-layer');
    if (!layer) return;

    firstMeteorTriggered = false;
    const interval = act.meteorIntervalMs ?? 6000;
    intervalId = setInterval(spawnMeteor, interval);
  }

  function destroy() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    if (layer) layer.innerHTML = '';
    layer = null;
    act = null;
    firstMeteorTriggered = false;
  }

  window.Act3Meteors = { init, destroy };
})();
