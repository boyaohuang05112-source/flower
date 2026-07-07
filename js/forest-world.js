(function () {
  'use strict';

  let track, world, prepared = false;

  function getDirectActIndex() {
    const act = new URLSearchParams(location.search).get('act');
    if (act === '4') return 3;
    if (act === '3') return 2;
    if (act === '2') return 1;
    return null;
  }

  function prepare() {
    if (prepared) return;
    track = document.getElementById('forest-track');
    world = document.getElementById('forest-world');
    if (!track || !world) return;

    prepared = true;
    track.innerHTML = '';
    window.ForestActs.initAct1(track);
  }

  function beginDirectAct(index) {
    track = document.getElementById('forest-track');
    world = document.getElementById('forest-world');
    if (!track || !world) return;

    prepared = true;

    const forestApp = document.getElementById('forest-app');
    const welcome = document.getElementById('welcome');
    welcome?.classList.add('is-hidden');
    welcome?.classList.remove('is-visible');
    forestApp?.classList.remove('is-hidden', 'forest-prewarm', 'forest-opening');
    forestApp?.classList.add('is-visible');

    window.ForestActs.startAtAct(index);
    document.getElementById('forest-sunlight')?.classList.add('is-active');
    document.getElementById('forest-ui')?.classList.remove('is-hidden');

    document.dispatchEvent(new CustomEvent('openingMonologueDone'));
    document.dispatchEvent(new CustomEvent('entranceComplete'));
  }

  function begin() {
    if (!prepared) prepare();

    const forestApp = document.getElementById('forest-app');
    const section = track?.querySelector('.act-section');

    forestApp?.classList.remove('forest-prewarm', 'is-hidden');
    forestApp?.classList.add('is-visible', 'is-front', 'forest-opening');

    document.getElementById('forest-sunlight')?.classList.add('is-active');
    document.getElementById('forest-ui')?.classList.remove('is-hidden');
    if (world) world.scrollLeft = 0;
    window.Butterflies?.init(section, window.ACTS[0]);
    window.Monologue?.playOpening(world);
  }

  document.addEventListener('loadingComplete', () => {
    const directIndex = getDirectActIndex();
    if (directIndex != null) beginDirectAct(directIndex);
    else prepare();
  });
  document.addEventListener('entranceComplete', () => {
    if (getDirectActIndex() == null) begin();
  });
})();
