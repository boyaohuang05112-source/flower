(function () {
  'use strict';

  const lamp = document.getElementById('hint-lamp');
  const openedActs = new Set();

  function currentAct() {
    return window.ACTS?.[window.CURRENT_ACT];
  }

  function showLamp() {
    const act = currentAct();
    if (!lamp || !act) return;
    lamp.classList.add('is-visible');
    lamp.classList.toggle('is-used', openedActs.has(act.id));
  }

  function pulseGrassHints() {
    document.querySelectorAll('.grass-spot').forEach((spot) => {
      spot.classList.add('butterfly-hinted', 'has-butterfly-hint');
    });
    setTimeout(() => {
      document.querySelectorAll('.grass-spot').forEach((spot) => {
        spot.classList.remove('has-butterfly-hint');
      });
    }, 6000);
  }

  function pulseSunflowerHints() {
    document.querySelectorAll('.sunflower-glow-halo:not(.is-picked)').forEach((el) => {
      el.classList.add('has-lamp-hint');
    });
    setTimeout(() => {
      document.querySelectorAll('.sunflower-glow-halo.has-lamp-hint').forEach((el) => {
        el.classList.remove('has-lamp-hint');
      });
    }, 6000);
  }

  function onClick() {
    const act = currentAct();
    if (!act || openedActs.has(act.id) || !lamp) return;

    openedActs.add(act.id);
    lamp.classList.add('is-used');

    if (act.id === 'entrance') pulseGrassHints();
    else if (act.id === 'deep-forest' || act.id === 'arthur-seat') pulseSunflowerHints();

    const lines = act.hintLines || [];
    if (!lines.length) return;

    window.Monologue?.showDialogueLines(lines, {
      charMs: 50,
      linePause: 420,
      holdMs: act.id === 'deep-forest' || act.id === 'arthur-seat' ? 2200 : 1600,
    });
  }

  function init() {
    if (!lamp) return;
    lamp.addEventListener('click', onClick);
  }

  document.addEventListener('openingMonologueDone', showLamp);
  document.addEventListener('entranceComplete', init);
  document.addEventListener('actChanged', showLamp);
})();
