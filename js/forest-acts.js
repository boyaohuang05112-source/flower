(function () {
  'use strict';

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function getAct() {
    return window.ACTS?.[window.CURRENT_ACT];
  }

  function getSection(index) {
    return document.querySelector(`.act-section[data-act-index="${index}"]`);
  }

  function viewportWidth() {
    return window.innerWidth || document.documentElement.clientWidth || 1200;
  }

  function buildActSection(act, index) {
    const section = document.createElement('section');
    section.className = 'forest-scroll act-section';
    section.dataset.act = act.id;
    section.dataset.actIndex = index;
    section.style.width = '100%';
    if (index > 0) section.classList.add('is-locked');

    const art = document.createElement('div');
    art.className = 'forest-art';
    const artW = viewportWidth();
    if (act.id === 'entrance') {
      art.innerHTML = window.Illustrations.buildForestEntrance(artW, 900);
    } else if (act.id === 'deep-forest') {
      art.innerHTML = window.Illustrations.buildLondonForest(artW, 900);
    } else if (act.id === 'arthur-seat') {
      art.innerHTML = window.Illustrations.buildArthurSeatForest(artW, 900);
    } else if (act.id === 'park-street') {
      art.innerHTML = window.Illustrations.buildParkStreet(artW, 900);
    } else {
      art.innerHTML = window.Illustrations.buildLongForest(artW, 900);
    }

    const interact = document.createElement('div');
    interact.className = 'forest-interact';

    (act.wildFlowers || []).forEach((f, i) => {
      const spot = document.createElement('div');
      spot.className = 'flower-spot wild-spot';
      spot.style.left = `${f.x}%`;
      spot.style.top = `${f.y}%`;
      window.FlowerInteract.bindWildFlower(spot, f, i);
      interact.appendChild(spot);
    });

    (act.grassSpots || []).forEach((g) => {
      const spot = document.createElement('div');
      spot.className = 'grass-spot';
      spot.style.left = `${g.x}%`;
      spot.style.top = `${g.y}%`;
      window.FlowerInteract.bindGrassSpot(spot, g);
      interact.appendChild(spot);
    });

    if (act.id !== 'entrance') {
      const suns = (window.SUNFLOWERS || []).filter((s) =>
        act.sunflowerIds.includes(s.instanceId) && !s.hidden
      );
      suns.forEach((f) => {
        const spot = document.createElement('div');
        spot.className = 'flower-spot sunflower-spot';
        spot.style.left = `${f.x}%`;
        spot.style.top = `${f.y}%`;
        window.FlowerInteract.bindSunflower(spot, f);
        interact.appendChild(spot);
      });
    }

    section.appendChild(art);
    section.appendChild(interact);

    if (act.id === 'park-street') {
      const walkStage = document.createElement('div');
      walkStage.className = 'act4-walk-stage';
      const passFlowers = document.createElement('div');
      passFlowers.className = 'act4-pass-flowers';
      passFlowers.setAttribute('aria-hidden', 'true');
      const girlLayer = document.createElement('div');
      girlLayer.className = 'act4-girl-layer';
      girlLayer.innerHTML = window.Illustrations.buildAct4GirlScene(artW, 900);

      section.insertBefore(walkStage, art);
      walkStage.appendChild(art);
      walkStage.appendChild(passFlowers);
      walkStage.appendChild(girlLayer);

      const forestApp = document.getElementById('forest-app');
      if (forestApp && !forestApp.querySelector('.act4-finale-layer')) {
        const finaleLayer = document.createElement('div');
        finaleLayer.className = 'act4-finale-layer';
        finaleLayer.setAttribute('aria-hidden', 'true');
        finaleLayer.innerHTML = `
          <div class="act4-finale-stack">
            <div class="act4-bouquet-wrap"></div>
            <div class="act4-envelope-wrap">
              <button type="button" class="act4-envelope" aria-label="打开信" title="打开信"></button>
              <span class="act4-envelope-hint">点击打开</span>
            </div>
            <div class="act4-letter-sheet" hidden>
              <article class="act4-letter-paper">
                <div class="act4-letter-body"></div>
              </article>
            </div>
            <button type="button" class="act4-end-btn" hidden aria-label="再走一次">再走一次</button>
          </div>
        `;
        forestApp.appendChild(finaleLayer);
      }
    }

    const butterflyLayer = document.createElement('div');
    butterflyLayer.className = 'butterfly-layer';
    butterflyLayer.dataset.act = act.id;
    section.appendChild(butterflyLayer);

    if (act.basketFlowers?.length) {
      window.FlowerInteract?.bindBasketHalos?.(section);
    }

    if (act.hiddenSunflowerSpots?.length) {
      window.FlowerInteract?.bindHiddenSunflowerHalos?.(section, act);
    }

    if (act.coupleDialogue?.length) {
      window.FlowerInteract?.bindCoupleDialogue?.(section, act);
    }

    if (act.id === 'arthur-seat') {
      const meteorLayer = document.createElement('div');
      meteorLayer.className = 'act3-meteor-layer';
      meteorLayer.setAttribute('aria-hidden', 'true');
      section.appendChild(meteorLayer);

      const fireflyLayer = document.createElement('div');
      fireflyLayer.className = 'act3-firefly-layer';
      fireflyLayer.setAttribute('aria-hidden', 'true');
      section.appendChild(fireflyLayer);
    }

    return section;
  }

  function setActAppClass(actIndex) {
    const forestApp = document.getElementById('forest-app');
    const actId = window.ACTS?.[actIndex]?.id;
    if (!forestApp) return;
    forestApp.classList.toggle('is-act2', actId === 'deep-forest');
    forestApp.classList.toggle('is-act3', actId === 'arthur-seat');
    forestApp.classList.toggle('is-act4', actId === 'park-street');
  }

  async function whiteFlashReveal(onMidpoint, opts = {}) {
    const wash = document.getElementById('forest-white-wash');
    const fadeIn = opts.fadeIn ?? 2400;
    const hold = opts.hold ?? 2400;
    const fadeOut = opts.fadeOut ?? 2600;

    if (!wash) {
      if (onMidpoint) await onMidpoint();
      return;
    }

    wash.style.transition = `opacity ${fadeIn}ms var(--ease-soft)`;
    wash.classList.remove('is-reveal', 'is-active');
    void wash.offsetWidth;
    wash.classList.add('is-active');
    await wait(hold);

    if (onMidpoint) await onMidpoint();

    wash.style.transition = `opacity ${fadeOut}ms var(--ease-soft)`;
    wash.classList.add('is-reveal');
    await wait(fadeOut);
    wash.classList.remove('is-active', 'is-reveal');
    wash.style.transition = '';
  }

  let actOpeningTimer = null;

  function scheduleActOpening(act) {
    if (actOpeningTimer) {
      clearTimeout(actOpeningTimer);
      actOpeningTimer = null;
    }
    if (!act?.openingLines?.length || act?.id === 'park-street') return;
    const delay = act.openingDelayMs ?? 3000;
    actOpeningTimer = setTimeout(() => {
      actOpeningTimer = null;
      window.Monologue?.playActOpening?.(act.openingLines, { delayMs: 0 });
    }, delay);
  }

  function syncAct3Meteors(section, actData) {
    window.Act3Meteors?.destroy?.();
    window.Act3Fireflies?.destroy?.();
    if (actData?.id === 'arthur-seat' && section) {
      window.Act3Meteors?.init?.(section, actData);
      window.Act3Fireflies?.init?.(section);
    }
  }

  function syncAct4Walk(section, actData) {
    window.Act4Walk?.destroy?.();
    if (actData?.id === 'park-street' && section) {
      window.Act4Walk?.init?.(section, actData);
    }
  }

  async function switchToAct(section, nextSection, nextIndex, nextAct) {
    section?.classList.add('is-locked');
    nextSection?.classList.remove('is-locked');
    window.CURRENT_ACT = nextIndex;
    window.FOREST_WIDTH = viewportWidth();
    window.Butterflies?.destroy?.();
    if (nextSection && nextAct) window.Butterflies?.init(nextSection, nextAct);
    setActAppClass(nextIndex);
    scheduleActOpening(nextAct);
    syncAct3Meteors(nextSection, nextAct);
    syncAct4Walk(nextSection, nextAct);
  }

  async function completeActWithEndSequence(act, section, nextIndex, nextSection, nextAct, forestApp) {
    await window.Monologue?.waitUntilIdle?.();
    await window.Monologue?.playEndSequence?.(act.endSequence);
    forestApp?.classList.add('act-transitioning');
    await whiteFlashReveal(async () => {
      await switchToAct(section, nextSection, nextIndex, nextAct);
    }, act.whiteFlash);
    forestApp?.classList.remove('act-transitioning');
  }

  async function completeAct() {
    const act = getAct();
    const forestApp = document.getElementById('forest-app');
    const section = getSection(window.CURRENT_ACT);
    const nextIndex = window.CURRENT_ACT + 1;
    const nextSection = getSection(nextIndex);
    const nextAct = window.ACTS?.[nextIndex];
    if (!act || !section) return;

    if (act.endSequence && nextSection && nextAct) {
      await completeActWithEndSequence(act, section, nextIndex, nextSection, nextAct, forestApp);
      document.dispatchEvent(new CustomEvent('actChanged', {
        detail: { act: window.ACTS[window.CURRENT_ACT]?.id },
      }));
      return;
    }

    if (act.endLines?.length) {
      await window.Monologue?.showDialogueLines(act.endLines, {
        charMs: 52,
        linePause: 500,
        holdMs: 4500,
      });
    }

    if (!nextSection || !nextAct) return;

    forestApp?.classList.add('act-transitioning');

    await whiteFlashReveal(async () => {
      await switchToAct(section, nextSection, nextIndex, nextAct);
    });

    forestApp?.classList.remove('act-transitioning');

    document.dispatchEvent(new CustomEvent('actChanged', {
      detail: { act: window.ACTS[window.CURRENT_ACT]?.id },
    }));
  }

  function initAllActs(track) {
    window.CURRENT_ACT = 0;
    track.innerHTML = '';
    track.style.transform = '';

    window.ACTS.forEach((act, index) => {
      track.appendChild(buildActSection(act, index));
    });

    window.FOREST_WIDTH = viewportWidth();
    return getSection(0);
  }

  function initAct1(track) {
    return initAllActs(track);
  }

  function startAtAct(actIndex) {
    const track = document.getElementById('forest-track');
    if (!track || !window.ACTS?.[actIndex]) return null;

    track.innerHTML = '';
    track.style.transform = '';
    window.ACTS.forEach((act, index) => {
      track.appendChild(buildActSection(act, index));
    });

    window.CURRENT_ACT = actIndex;
    window.FOREST_WIDTH = viewportWidth();

    window.ACTS.forEach((_, index) => {
      const section = getSection(index);
      if (!section) return;
      section.classList.toggle('is-locked', index !== actIndex);
    });

    const section = getSection(actIndex);
    window.Butterflies?.destroy?.();
    window.Butterflies?.init(section, window.ACTS[actIndex]);
    setActAppClass(actIndex);
    scheduleActOpening(window.ACTS[actIndex]);
    syncAct3Meteors(section, window.ACTS[actIndex]);
    syncAct4Walk(section, window.ACTS[actIndex]);
    return section;
  }

  window.ForestActs = { initAct1, initAllActs, buildActSection, completeAct, getAct, startAtAct };
})();
