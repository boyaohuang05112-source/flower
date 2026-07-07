(function () {
  'use strict';

  let section = null;
  let act = null;
  let rafId = null;
  let state = 'idle';
  let walkStart = 0;
  let sequenceStarted = false;
  let encounterIndex = 0;
  let walkBase = 0;
  let walkEngineStart = 0;
  let walkEngineBase = 0;
  let letterEndTimer = null;

  const WALK_RATE = 0.5 / 6000;

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function encounters() {
    return act?.girlEncounters || [];
  }

  function currentEncounter() {
    return encounters()[encounterIndex];
  }

  function setWalkProgress(p) {
    if (!section) return;
    section.style.setProperty('--walk-p', String(Math.max(0, p)));
  }

  function girlFigure(index) {
    return section?.querySelector(`.act4-girl-figure[data-encounter="${index}"]`);
  }

  function girlAnchor(enc) {
    const art = section?.querySelector('.act4-girl-art');
    const w = art?.clientWidth || window.innerWidth;
    const h = art?.clientHeight || window.innerHeight;
    return {
      cx: w * (enc?.anchorX ?? 0.74),
      gy: h * (enc?.anchorY ?? 0.92),
    };
  }

  function setGirlVisual(index, opacity, scale) {
    const fig = girlFigure(index);
    const enc = encounters()[index];
    if (!fig || !enc) return;
    const { cx, gy } = girlAnchor(enc);
    fig.setAttribute('opacity', String(Math.max(0, Math.min(1, opacity))));
    fig.setAttribute('transform', `translate(${cx}, ${gy}) scale(${scale})`);
  }

  function hideChatHint(index) {
    section?.querySelector(`.act4-girl-chat-hint[data-encounter="${index}"]`)?.classList.add('is-hidden');
  }

  function showChatHint(index) {
    const hint = section?.querySelector(`.act4-girl-chat-hint[data-encounter="${index}"]`);
    if (!hint) return;
    hint.classList.remove('is-hidden');
    window.FlowerInteract?.bindGirlDialogue?.(section, index, encounters()[index]?.dialogue);
  }

  function buildPassFlowers(container) {
    if (!container || !window.Illustrations?.flowerSvg) return;
    const types = ['daisy', 'buttercup', 'yarrow', 'foxglove', 'wildrose', 'lavender'];
    container.innerHTML = '';
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.className = 'act4-pass-flower';
      el.dataset.offset = String(i / 14);
      el.dataset.x = String(18 + (i % 6) * 13 + ((i * 17) % 9));
      el.dataset.side = i % 2 === 0 ? '-1' : '1';
      el.innerHTML = window.Illustrations.flowerSvg(types[i % types.length], 28 + (i % 4) * 5);
      container.appendChild(el);
    }
  }

  function updatePassFlowers(p) {
    section?.querySelectorAll('.act4-pass-flower').forEach((el) => {
      const offset = parseFloat(el.dataset.offset || '0');
      const side = parseFloat(el.dataset.side || '1');
      const fp = ((p * 1.15 + offset) % 1);
      const y = 28 + fp * 82;
      const x = parseFloat(el.dataset.x || '50');
      const drift = side * fp * 6;
      const scale = 0.35 + fp * 0.55;
      const alpha = fp > 0.04 && fp < 0.94 ? Math.min(1, fp * 2.8, (1 - fp) * 3.2) : 0;
      el.style.left = `${x + drift}%`;
      el.style.top = `${y}%`;
      el.style.transform = `translate(-50%, -50%) scale(${scale})`;
      el.style.opacity = String(alpha);
    });
  }

  function syncContinuousWalk(now) {
    const p = walkEngineBase + (now - walkEngineStart) * WALK_RATE;
    setWalkProgress(p);
    updatePassFlowers(p);
    return p;
  }

  function startContinuousWalk() {
    walkEngineStart = performance.now();
    walkEngineBase = walkBase;
    state = 'continuous-walking';
    section?.classList.add('is-act4-walking');
    section?.classList.remove('is-act4-stopped');
    ensureAnimLoop();
  }

  function stopContinuousWalk() {
    if (state !== 'continuous-walking') return;
    walkBase = walkEngineBase + (performance.now() - walkEngineStart) * WALK_RATE;
    state = 'idle';
    section?.classList.remove('is-act4-walking');
  }

  function ensureAnimLoop() {
    if (rafId) return;
    const loop = (now) => {
      if (state === 'continuous-walking') syncContinuousWalk(now);
      if (state === 'walking') encounterTick(now);
      if (state === 'continuous-walking' || state === 'walking') {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    };
    rafId = requestAnimationFrame(loop);
  }

  function stopAtGirl() {
    const enc = currentEncounter();
    if (!enc) return;
    state = 'stopped';
    section?.classList.remove('is-act4-walking');
    section?.classList.add('is-act4-stopped');
    setGirlVisual(encounterIndex, 1, enc.endScale ?? 1.05);
    showChatHint(encounterIndex);
  }

  function encounterTick(now) {
    if (state !== 'walking' || !section) return;

    const enc = currentEncounter();
    if (!enc) return;

    const elapsed = now - walkStart;
    const walkMs = enc.walkDurationMs ?? 6000;
    const stopMs = enc.walkStopMs ?? walkMs + 800;
    const segmentP = Math.min(1.05, elapsed / walkMs);

    setWalkProgress(walkBase + segmentP);
    updatePassFlowers(walkBase + segmentP);

    const girlStart = walkMs * (enc.girlAppearAt ?? 0.5);
    if (elapsed >= girlStart) {
      const girlP = Math.min(1, (elapsed - girlStart) / (stopMs - girlStart));
      const startSc = enc.startScale ?? 0.28;
      const endSc = enc.endScale ?? 1.05;
      setGirlVisual(encounterIndex, girlP, startSc + girlP * (endSc - startSc));
    }

    if (elapsed >= stopMs) stopAtGirl();
  }

  function walkForMs(durationMs, progressSpan = 0.5) {
    return new Promise((resolve) => {
      if (!section) {
        resolve();
        return;
      }
      const prevState = state;
      state = 'preamble-walking';
      walkStart = performance.now();
      const startBase = walkBase;
      section.classList.add('is-act4-walking');
      section.classList.remove('is-act4-stopped');

      const step = (now) => {
        const elapsed = now - walkStart;
        const t = Math.min(1, elapsed / durationMs);
        const p = startBase + t * progressSpan;
        setWalkProgress(p);
        updatePassFlowers(p);
        if (elapsed >= durationMs) {
          walkBase = startBase + progressSpan;
          state = prevState === 'continuous-walking' ? 'continuous-walking' : 'idle';
          if (state === 'idle') section.classList.remove('is-act4-walking');
          resolve();
          return;
        }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  function startWalkSegment(index) {
    if (!section) return;
    encounterIndex = index;
    const enc = currentEncounter();
    if (!enc) return;

    state = 'walking';
    walkStart = performance.now();
    setGirlVisual(index, 0, enc.startScale ?? 0.28);
    hideChatHint(index);
    section.classList.add('is-act4-walking');
    section.classList.remove('is-act4-stopped');
    ensureAnimLoop();
  }

  async function runBetweenEncounters(prevIdx, nextIdx) {
    const prev = encounters()[prevIdx];
    const next = encounters()[nextIdx];
    if (!next) return;

    await wait(prev?.resumeDelayMs ?? 1000);
    walkBase += 1;

    if (next.preamble) {
      const pre = next.preamble;
      startContinuousWalk();
      await wait(pre.walkToMonologueMs ?? 6000);

      if (pre.monologue?.length) {
        await window.Monologue?.showDialogueExchange?.(
          pre.monologue.map((text) => ({ speaker: '我', text })),
          { charMs: 52, lineHold: 880, holdMs: 1500 }
        );
      }

      await wait(pre.delayAfterMonologueMs ?? 6000);
      stopContinuousWalk();
      await walkForMs(1200, 0.15);
    }

    startWalkSegment(nextIdx);
  }

  async function act4SlowWhiteFlash(opts = {}) {
    const wash = document.getElementById('forest-white-wash');
    const fadeIn = opts.fadeIn ?? 3500;
    if (!wash) {
      await wait(fadeIn);
      return;
    }
    wash.classList.remove('is-reveal');
    wash.style.transition = `opacity ${fadeIn}ms var(--ease-soft)`;
    wash.classList.add('is-active');
    await wait(fadeIn);
  }

  function getFinaleConfig() {
    return act?.act4Finale || window.ACTS?.find((a) => a.id === 'park-street')?.act4Finale;
  }

  function isFinalePreview() {
    const mode = new URLSearchParams(location.search).get('finale');
    return mode === 'letter' || mode === 'bouquet' || mode === 'narration';
  }

  function getFinaleLayer() {
    const layer = document.getElementById('forest-app')?.querySelector('.act4-finale-layer');
    if (layer && !layer.querySelector('.act4-end-btn')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'act4-end-btn';
      btn.hidden = true;
      btn.textContent = '结束';
      btn.setAttribute('aria-label', '结束');
      layer.querySelector('.act4-finale-stack')?.appendChild(btn);
    }
    return layer;
  }

  function renderLetterBody(paragraphs) {
    return (paragraphs || [])
      .map((p) => `<p>${p}</p>`)
      .join('');
  }

  function bindAct4Envelope(layer) {
    const btn = layer?.querySelector('.act4-envelope');
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.innerHTML = window.Illustrations?.envelopeSvg?.() || '';
    btn.addEventListener('click', () => openAct4Letter());
    layer?.querySelector('.act4-envelope-wrap')?.addEventListener('click', (e) => {
      if (e.target === btn || btn.contains(e.target)) return;
      openAct4Letter();
    });
  }

  function openAct4Letter() {
    const layer = getFinaleLayer();
    const body = layer?.querySelector('.act4-letter-body');
    const letter = getFinaleConfig()?.letter;
    if (body && letter?.length) {
      body.innerHTML = renderLetterBody(letter);
    }
    layer?.querySelector('.act4-letter-sheet')?.removeAttribute('hidden');
    layer?.classList.add('is-letter-open', 'is-envelope-hidden');
    scheduleAct4EndButton();
  }

  function clearAct4EndTimer() {
    if (letterEndTimer) {
      clearTimeout(letterEndTimer);
      letterEndTimer = null;
    }
  }

  function scheduleAct4EndButton() {
    clearAct4EndTimer();
    letterEndTimer = setTimeout(() => {
      letterEndTimer = null;
      showAct4EndButton();
    }, getFinaleConfig()?.endButtonDelayMs ?? 3000);
  }

  function showAct4EndButton() {
    const layer = getFinaleLayer();
    const btn = layer?.querySelector('.act4-end-btn');
    if (!btn || btn.dataset.bound) {
      layer?.classList.add('is-end-visible');
      return;
    }
    btn.dataset.bound = '1';
    btn.textContent = '再走一次';
    btn.setAttribute('aria-label', '再走一次');
    btn.removeAttribute('hidden');
    btn.addEventListener('click', () => {
      btn.disabled = true;
      void finishAndReturnToWelcome();
    });
    layer?.classList.add('is-end-visible');
  }

  async function finishAndReturnToWelcome() {
    clearAct4EndTimer();
    await window.Welcome?.returnFromFinale?.(getFinaleConfig()?.returnFlash);
  }

  function showAct4Envelope() {
    const layer = getFinaleLayer();
    if (!layer) return;
    bindAct4Envelope(layer);
    layer.classList.add('is-envelope-visible');
    layer.style.pointerEvents = 'auto';
  }

  async function revealAct4Bouquet() {
    const layer = getFinaleLayer();
    const wrap = layer?.querySelector('.act4-bouquet-wrap');
    if (!wrap || !window.Illustrations?.buildAct4SunflowerBouquet) return;
    const fin = getFinaleConfig();
    const w = window.innerWidth;
    const h = window.innerHeight;
    wrap.innerHTML = window.Illustrations.buildAct4SunflowerBouquet(w, h);
    requestAnimationFrame(() => layer?.classList.add('is-bouquet-visible'));
    await wait(fin?.bouquetEnlargeDelayMs ?? 2200);
    layer?.classList.add('is-bouquet-enlarged');
    await wait(fin?.envelopeDelayMs ?? 2400);
    showAct4Envelope();
  }

  async function previewFinale(mode, actData, sectionEl) {
    act = actData;
    section = sectionEl;
    sequenceStarted = true;

    const wash = document.getElementById('forest-white-wash');
    if (wash) {
      wash.style.transition = '';
      wash.classList.add('is-active');
    }
    document.getElementById('forest-ui')?.classList.add('is-hidden');

    if (mode === 'narration') {
      const fin = getFinaleConfig();
      if (fin?.narration?.length) {
        await wait(400);
        await window.Monologue?.showNarration?.(fin.narration, {
          charMs: 50,
          lineHold: 820,
          blankPause: 320,
          holdMs: 1200,
        });
      }
      return;
    }

    const layer = getFinaleLayer();
    const wrap = layer?.querySelector('.act4-bouquet-wrap');
    if (wrap && window.Illustrations?.buildAct4SunflowerBouquet) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      wrap.innerHTML = window.Illustrations.buildAct4SunflowerBouquet(w, h);
      layer?.classList.add('is-bouquet-visible');
    }

    if (mode === 'letter') {
      layer?.classList.add('is-bouquet-enlarged');
      await wait(500);
      openAct4Letter();
      return;
    }

    const fin = getFinaleConfig();
    await wait(fin?.bouquetEnlargeDelayMs ?? 2200);
    layer?.classList.add('is-bouquet-enlarged');
    await wait(fin?.envelopeDelayMs ?? 2400);
    showAct4Envelope();
  }

  async function runAct4Finale() {
    const fin = act?.act4Finale;
    if (!fin) return;

    startContinuousWalk();
    await wait(fin.walkBeforeFlashMs ?? 3000);
    stopContinuousWalk();

    await act4SlowWhiteFlash(fin.whiteFlash);

    if (fin.narration?.length) {
      await window.Monologue?.showNarration?.(fin.narration, {
        charMs: 50,
        lineHold: 820,
        blankPause: 320,
        holdMs: 1200,
      });
    }

    await revealAct4Bouquet();
  }

  async function showEncounterSunflowerCard(enc) {
    const flower = (window.SUNFLOWERS || []).find((s) => s.instanceId === enc?.sunflowerId);
    if (!flower || !window.FlowerInteract?.openSunflowerCard) return;

    await wait(enc.sunflowerCardDelayMs ?? 500);

    await new Promise((resolve) => {
      window.FlowerInteract.openSunflowerCard(flower, {
        enlarge: true,
        onClose: resolve,
      });
    });

    if (enc.postCardMonologue?.length) {
      await window.Monologue?.waitUntilIdle?.();
      await window.Monologue?.showDialogueExchange?.(
        enc.postCardMonologue.map((text) => ({ speaker: '我', text })),
        { charMs: 52, lineHold: 880, holdMs: 1500 }
      );
    }
  }

  async function onEncounterDialogueDone(e) {
    const idx = e.detail?.index;
    if (idx == null || !section || !act) return;

    hideChatHint(idx);
    setGirlVisual(idx, 0, 0);

    const enc = encounters()[idx];
    await showEncounterSunflowerCard(enc);

    const next = idx + 1;
    if (next >= encounters().length) {
      await runAct4Finale();
      return;
    }

    await runBetweenEncounters(idx, next);
  }

  async function runSequence() {
    if (!act || sequenceStarted) return;
    sequenceStarted = true;
    encounterIndex = 0;
    walkBase = 0;

    await wait(act.openingDelayMs ?? 2000);

    if (act.openingLines?.length) {
      await window.Monologue?.showDialogueExchange?.(
        act.openingLines.map((text) => ({ speaker: '我', text })),
        { charMs: 52, lineHold: 880, holdMs: 1500 }
      );
    }

    await wait(act.walkDelayAfterOpeningMs ?? 3000);
    startWalkSegment(0);
  }

  function init(sectionEl, actData) {
    destroy();
    if (actData?.id !== 'park-street') return;

    section = sectionEl;
    act = actData;
    state = 'idle';
    sequenceStarted = false;
    encounterIndex = 0;
    walkBase = 0;
    setWalkProgress(0);

    encounters().forEach((enc, i) => {
      setGirlVisual(i, 0, enc.startScale ?? 0.28);
      hideChatHint(i);
    });

    const passLayer = section.querySelector('.act4-pass-flowers');
    buildPassFlowers(passLayer);

    if (isFinalePreview()) {
      const mode = new URLSearchParams(location.search).get('finale');
      void previewFinale(mode, actData, sectionEl);
      return;
    }

    document.addEventListener('act4EncounterDialogueDone', onEncounterDialogueDone);
    void runSequence();
  }

  function destroy() {
    clearAct4EndTimer();
    document.removeEventListener('act4EncounterDialogueDone', onEncounterDialogueDone);
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    section?.classList.remove('is-act4-walking', 'is-act4-stopped');
    document.getElementById('forest-app')?.querySelector('.act4-finale-layer')?.classList.remove(
      'is-bouquet-visible',
      'is-bouquet-enlarged',
      'is-envelope-visible',
      'is-envelope-hidden',
      'is-letter-open',
      'is-end-visible'
    );
    const letterSheet = document.getElementById('forest-app')?.querySelector('.act4-letter-sheet');
    letterSheet?.setAttribute('hidden', '');
    letterSheet?.querySelector('.act4-letter-body')?.replaceChildren();
    const endBtn = document.getElementById('forest-app')?.querySelector('.act4-end-btn');
    if (endBtn) {
      endBtn.setAttribute('hidden', '');
      endBtn.disabled = false;
      delete endBtn.dataset.bound;
    }
    const envBtn = document.getElementById('forest-app')?.querySelector('.act4-envelope');
    if (envBtn) {
      delete envBtn.dataset.bound;
      envBtn.replaceChildren();
    }
    section?.style.removeProperty('--walk-p');
    section = null;
    act = null;
    state = 'idle';
    sequenceStarted = false;
    encounterIndex = 0;
    walkBase = 0;
  }

  window.Act4Walk = { init, destroy, previewFinale };
})();
