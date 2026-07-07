(function () {
  'use strict';

  function html(flowerId) {
    return `<button type="button" class="act3-html-halo sunflower-glow-halo is-faint" data-flower-id="${flowerId}" aria-label="向日葵">
      <span class="act3-halo-outer" aria-hidden="true"></span>
      <span class="act3-halo-mid" aria-hidden="true"></span>
      <span class="act3-halo-core" aria-hidden="true"></span>
    </button>`;
  }

  function bindHalo(el) {
    if (!el || el.dataset.act3Bound) return;
    const flowerId = el.dataset.flowerId;
    const flower = (window.SUNFLOWERS || []).find((s) => s.instanceId === flowerId);
    if (!flower) return;
    el.dataset.act3Bound = '1';
    el.addEventListener('click', () => {
      if (el.classList.contains('is-picked')) return;
      window.FlowerInteract?.openSunflowerCard?.(flower);
    });
  }

  function bindSection(section) {
    section?.querySelectorAll('.sunflower-glow-halo[data-flower-id]').forEach(bindHalo);
  }

  window.Act3Halo = { html, bindHalo, bindSection };
})();
