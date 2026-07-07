(function () {
  'use strict';

  let modal, cardContent;
  let pendingCardClose = null;

  function ensureModal() {
    if (modal) return;
    modal = document.getElementById('botanical-modal');
    cardContent = document.getElementById('botanical-card-content');
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-close]')) closeCard();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCard();
    });
  }

  function getSunflowerMeta(flower) {
    const variant = flower.variant || 'chenguang';
    return window.FLOWER_DATA[variant] || window.FLOWER_DATA.chenguang;
  }

  function formatLines(text) {
    return (text || '').split('\n').map((line) => `<span class="card-line">${line}</span>`).join('');
  }

  function buildSunflowerCardSections(meta) {
    const meaningLabel = meta.meaningLabel || '寓意';
    const meaningSection = `
      <p class="card-section-label">${meaningLabel}</p>
      <div class="card-meaning-lines">${formatLines(meta.meaning)}</div>
    `;
    const introSection = `
      <p class="card-section-label">介绍</p>
      <div class="card-desc card-desc-lines">${formatLines(meta.intro)}</div>
    `;
    if (meta.meaningFirst) {
      return meaningSection + introSection;
    }
    return `
      ${introSection}
      <p class="card-meaning-block"><span>${meaningLabel}</span><span class="card-meaning-lines">${formatLines(meta.meaning)}</span></p>
    `;
  }

  function openSunflowerCard(flower, opts) {
    ensureModal();
    const meta = getSunflowerMeta(flower);
    const picked = window.Collection.picked.has(flower.instanceId);

    cardContent.className = 'botanical-card sunflower-card';
    cardContent.innerHTML = `
      <div class="card-flower-art sunflower-glow-art">${window.Illustrations.flowerSvg('sunflower', 92)}</div>
      ${meta.label ? `<p class="card-label">${meta.label}</p>` : ''}
      <h2 class="card-title">${meta.name}</h2>
      ${buildSunflowerCardSections(meta)}
      <div class="card-actions">
        ${picked ? '<span class="btn-pill is-muted">已带走</span>' :
          `<button class="btn-pill" data-pick="${flower.instanceId}">带它一起走吧 🌻</button>`}
      </div>
    `;

    pendingCardClose = opts?.onClose || null;
    if (opts?.enlarge) modal.classList.add('is-act4-reveal');

    cardContent.querySelector('[data-pick]')?.addEventListener('click', () => {
      pickFlower(flower.instanceId);
      closeCard();
    });
    modal.classList.add('is-open');
  }

  function formatVoiceLines(lines) {
    return (lines || [])
      .filter((line) => line !== '')
      .map((line) => `<span class="card-line">${line}</span>`)
      .join('');
  }

  function openWildCard(flower) {
    ensureModal();
    const data = window.FLOWER_DATA[flower.type];
    if (!data || !cardContent) return;

    cardContent.className = 'botanical-card plant-card';
    cardContent.innerHTML = `
      <div class="card-flower-art">${window.Illustrations.flowerSvg(flower.type, 76)}</div>
      <h2 class="card-title">${data.name}</h2>
      <dl class="card-meta">
        <dt>花语</dt>
        <dd>${data.meaning}</dd>
      </dl>
      <div class="card-desc card-desc-lines">${formatLines(data.description)}</div>
      <hr class="card-voice-divider" />
      <div class="card-inner-voice">
        <p class="voice-label">我</p>
        <p class="voice-body">${formatVoiceLines(data.voice)}</p>
      </div>
      <button class="btn-pill" data-close>轻轻放下</button>
    `;
    modal.classList.add('is-open');
  }

  function closeCard() {
    modal?.classList.remove('is-open', 'is-act4-reveal');
    const done = pendingCardClose;
    pendingCardClose = null;
    done?.();
  }

  function pickFlower(instanceId) {
    if (!window.Collection.pick(instanceId)) return;

    const spot = document.querySelector(`[data-flower-id="${instanceId}"]`);
    spot?.classList.add('is-picked');

    const rect = spot?.querySelector('.hidden-sunflower')?.getBoundingClientRect()
      || spot?.getBoundingClientRect();
    const bag = document.getElementById('flower-bag');
    const bagRect = bag?.getBoundingClientRect();
    const ghost = document.createElement('div');
    ghost.className = 'pick-ghost';
    ghost.innerHTML = window.Illustrations.flowerSvg('sunflower', 44);

    const tx = bagRect ? bagRect.left + bagRect.width * 0.45 : window.innerWidth - 72;
    const ty = bagRect ? bagRect.top + bagRect.height * 0.35 : window.innerHeight - 72;

    if (rect) {
      ghost.style.cssText = `
        position:fixed;left:${rect.left + rect.width * 0.3}px;top:${rect.top}px;width:44px;height:44px;
        z-index:400;pointer-events:none;transition:all 1.5s cubic-bezier(0.45,0,0.15,1);
      `;
      document.body.appendChild(ghost);
      for (let i = 0; i < 5; i++) {
        const petal = document.createElement('div');
        petal.className = 'falling-petal';
        petal.style.cssText = `left:${rect.left + 20}px;top:${rect.top + 10}px;`;
        document.body.appendChild(petal);
        setTimeout(() => petal.remove(), 1400);
      }
      requestAnimationFrame(() => {
        ghost.style.left = `${tx}px`;
        ghost.style.top = `${ty}px`;
        ghost.style.transform = 'scale(0.55)';
        ghost.style.opacity = '0.95';
      });
      setTimeout(() => { ghost.style.opacity = '0'; }, 1300);
      setTimeout(() => ghost.remove(), 1600);
      bag?.classList.add('is-bouncing');
      setTimeout(() => bag?.classList.remove('is-bouncing'), 700);
    }
  }

  function revealGrass(spot, flower) {
    if (spot.classList.contains('is-revealed') || spot.classList.contains('is-picked')) return;
    if (spot.classList.contains('is-revealing')) return;

    spot.classList.add('is-revealing', 'butterfly-hinted');
    spot.classList.remove('has-butterfly-hint');

    setTimeout(() => {
      spot.classList.add('is-revealed');
      spot.classList.remove('is-revealing');
      const hidden = spot.querySelector('.hidden-sunflower');
      hidden?.addEventListener('click', () => openSunflowerCard(flower));
      hidden?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') openSunflowerCard(flower);
      });
      setTimeout(() => openSunflowerCard(flower), 900);
    }, 1400);
  }

  function bindGrassSpot(spot, grass) {
    const flower = (window.SUNFLOWERS || []).find((s) => s.instanceId === grass.sunflowerId);
    if (!flower) return;

    spot.dataset.grassId = grass.instanceId;
    spot.dataset.flowerId = grass.sunflowerId;

    spot.innerHTML = `
      <button class="grass-hint-dot" type="button" aria-label="草丛">
        <span class="grass-hint-shimmer" aria-hidden="true">
          <span class="grass-hint-halo"></span>
          <span class="grass-hint-core"></span>
        </span>
      </button>
      <div class="grass-clump" aria-hidden="true">
        <span class="grass-blade g1"></span>
        <span class="grass-blade g2"></span>
        <span class="grass-blade g3"></span>
        <span class="grass-blade g4"></span>
      </div>
      <div class="hidden-sunflower" role="button" tabindex="0" aria-label="向日葵">
        <div class="flower-illustration sunflower-glow">${window.Illustrations.flowerSvg('sunflower', 56)}</div>
        <div class="flower-stem-remains">${window.Illustrations.stemRemains('sunflower', 56)}</div>
      </div>
    `;

    const onGrassClick = () => revealGrass(spot, flower);
    spot.querySelector('.grass-hint-dot').addEventListener('click', onGrassClick);
  }

  function bindSunflower(spot, flower) {
    spot.dataset.flowerId = flower.instanceId;
    spot.innerHTML = `
      <div class="flower-illustration">${window.Illustrations.flowerSvg('sunflower', 52)}</div>
      <div class="flower-stem-remains">${window.Illustrations.stemRemains('sunflower', 52)}</div>
    `;
    spot.querySelector('.flower-illustration').addEventListener('click', () => openSunflowerCard(flower));
  }

  function bindWildFlower(spot, flower, index = 0) {
    const data = window.FLOWER_DATA[flower.type];
    const sizes = [34, 40, 32, 38, 36];
    const offsets = [3, -4, 5, -2, 4];
    const delays = [0, 0.4, 0.8, 0.2, 0.6];
    const size = sizes[index % sizes.length];
    const offsetY = offsets[index % offsets.length];
    const delay = delays[index % delays.length];
    const side = index % 2 === 0 ? 'right' : 'left';

    spot.dataset.flowerId = flower.instanceId;
    spot.style.setProperty('--ring-delay', `${delay}s`);
    spot.innerHTML = `
      <button class="wild-spot-group" type="button" aria-label="${data?.name || '花朵'}" data-side="${side}">
        <span class="wild-glow-ring" style="--ring-size:${size}px;--ring-offset:${offsetY}px">
          <span class="wild-glow-halo" aria-hidden="true"></span>
          <span class="wild-glow-core" aria-hidden="true"></span>
        </span>
        <span class="wild-flower-beside" aria-hidden="true">${window.Illustrations.flowerSvg(flower.type, Math.round(size * 0.55))}</span>
      </button>
    `;
    spot.querySelector('.wild-spot-group').addEventListener('click', () => openWildCard(flower));
  }

  function bindBasketHalos(section) {
    const flowers = window.ACT2_BASKET_FLOWERS || [];
    section.querySelectorAll('.basket-glow-halo').forEach((el) => {
      const flower = flowers.find((f) => f.instanceId === el.dataset.flowerId && f.clickable);
      if (!flower) return;
      const open = () => openWildCard(flower);
      el.addEventListener('click', open);
    });
  }

  function bindCoupleDialogue(section, act) {
    const lines = act?.coupleDialogue;
    if (!lines?.length) return;
    section.querySelectorAll('.couple-chat-hint:not(.act4-girl-chat-hint)').forEach((el) => {
      el.addEventListener('click', () => {
        window.Monologue?.showDialogueExchange?.(lines, {
          charMs: 40,
          lineHold: 1000,
          holdMs: 2800,
        });
      });
    });
  }

  function bindGirlDialogue(section, encounterIndex, lines) {
    if (!lines?.length) return;
    section.querySelectorAll(`.act4-girl-chat-hint[data-encounter="${encounterIndex}"]:not([data-bound])`).forEach((el) => {
      el.dataset.bound = '1';
      el.addEventListener('click', async () => {
        el.classList.add('is-hidden');
        await window.Monologue?.showDialogueExchange?.(lines, {
          charMs: 40,
          lineHold: 1000,
          holdMs: 2800,
        });
        document.dispatchEvent(new CustomEvent('act4EncounterDialogueDone', {
          detail: { index: encounterIndex },
        }));
      });
    });
  }

  function bindHiddenSunflowerHalos(section, act) {
    const spots = act?.hiddenSunflowerSpots || [];
    section.querySelectorAll('.sunflower-glow-halo').forEach((el) => {
      const spot = spots.find((s) => s.sunflowerId === el.dataset.flowerId);
      if (!spot) return;
      const flower = (window.SUNFLOWERS || []).find((s) => s.instanceId === spot.sunflowerId);
      if (!flower) return;
      const open = () => {
        if (el.classList.contains('is-picked')) return;
        openSunflowerCard(flower);
      };
      el.addEventListener('click', open);
    });
  }

  function enableGrassSpots() {
    document.querySelectorAll('.grass-spot').forEach((spot) => {
      spot.classList.add('butterfly-hinted');
    });
  }

  document.addEventListener('openingMonologueDone', enableGrassSpots);
  document.addEventListener('entranceSettled', enableGrassSpots);

  window.FlowerInteract = {
    bindSunflower, bindWildFlower, bindGrassSpot, bindBasketHalos, bindHiddenSunflowerHalos,
    bindCoupleDialogue, bindGirlDialogue, openSunflowerCard, pickFlower, closeCard,
  };
})();
