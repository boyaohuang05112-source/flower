(function () {
  'use strict';

  function showFinale() {
    const act = window.ACTS?.[window.CURRENT_ACT];
    if (act?.id === 'park-street') return;

    const forest = document.getElementById('forest-app');
    const finale = document.getElementById('finale');
    if (!finale) return;

    document.getElementById('forest-ui')?.classList.add('is-hidden');
    forest?.classList.add('is-finale-transition');

    setTimeout(() => {
      forest?.classList.add('is-hidden');
      finale.classList.remove('is-hidden');
      finale.classList.add('is-visible');
      runFinaleSequence();
    }, 2800);
  }

  async function runFinaleSequence() {
    const stage = document.getElementById('bouquet-stage');
    const mono = document.getElementById('finale-monologue');
    const env = document.getElementById('envelope');
    if (!stage) return;

    stage.innerHTML = '<div class="bouquet-assemble" id="bouquet-assemble"></div>';
    const assemble = document.getElementById('bouquet-assemble');

    window.Collection.items.forEach((item, i) => {
      setTimeout(() => {
        const g = document.createElement('div');
        g.className = 'bouquet-flower';
        g.style.cssText = `--i:${i};left:${50 + (i % 4 - 1.5) * 18}%;top:${42 + Math.floor(i / 4) * 8}%`;
        g.innerHTML = window.Illustrations.flowerSvg('sunflower', 40);
        assemble?.appendChild(g);
        g.classList.add('is-placed');
      }, i * 280);
    });

    await wait(12 * 280 + 800);

    if (mono) {
      mono.classList.add('is-visible');
      mono.innerHTML = '<p>原来。</p><p>它们一直在等彼此。</p><p>现在，终于又见面了。</p>';
    }

    await wait(4000);
    if (env) {
      env.classList.add('is-falling');
      env.innerHTML = window.Illustrations.envelopeSvg();
    }
  }

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function initEnvelope() {
    const env = document.getElementById('envelope');
    const letter = document.getElementById('letter-panel');
    if (!env || !letter) return;
    env.addEventListener('click', () => letter.classList.add('is-open'));
  }

  function initActions() {
    document.getElementById('btn-restart')?.addEventListener('click', () => {
      window.Collection.reset();
      location.reload();
    });
  }

  document.addEventListener('allFlowersCollected', showFinale);
  document.addEventListener('entranceComplete', () => {
    initEnvelope();
    initActions();
  });
})();
