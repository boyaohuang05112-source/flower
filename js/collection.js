(function () {
  'use strict';

  window.Collection = {
    picked: new Set(),
    items: [],

    pick(instanceId) {
      if (this.picked.has(instanceId)) return false;
      this.picked.add(instanceId);
      this.items.push({ instanceId, type: 'sunflower' });
      document.dispatchEvent(new CustomEvent('flowerPicked', { detail: { instanceId, count: this.count() } }));
      return true;
    },

    count() { return this.items.length; },

    totalAvailable() {
      return window.SUNFLOWER_TOTAL || 12;
    },

    isComplete() {
      return this.count() >= this.totalAvailable();
    },

    reset() {
      this.picked.clear();
      this.items = [];
      document.dispatchEvent(new CustomEvent('collectionReset'));
    },
  };

  function actSunflowerCount(act) {
    return act.sunflowerIds.filter((id) => Collection.picked.has(id)).length;
  }

  function initBag() {
    const icon = document.getElementById('bag-icon');
    if (icon && window.Illustrations?.bagSvg) {
      icon.innerHTML = window.Illustrations.bagSvg();
    }
  }

  function updateProgress() {
    const el = document.getElementById('progress-text');
    const bag = document.getElementById('flower-bag');
    if (el) el.textContent = `${Collection.count()} / ${Collection.totalAvailable()}`;
    if (bag) {
      bag.classList.toggle('has-flowers', Collection.count() > 0);
      if (Collection.count() > 0) {
        bag.classList.add('is-bump');
        setTimeout(() => bag.classList.remove('is-bump'), 500);
      }
    }
  }

  function initProgress() {
    initBag();
    updateProgress();

    document.addEventListener('flowerPicked', (e) => {
      updateProgress();

      const id = e.detail?.instanceId;
      const pickLines = window.PICK_MONOLOGUES?.[id];
      const act = window.ACTS?.[window.CURRENT_ACT];
      const willCompleteAct = act && act.completeAt > 0 && actSunflowerCount(act) >= act.completeAt;

      if (pickLines && !willCompleteAct) {
        setTimeout(() => window.Monologue?.showDialogueLines(pickLines, {
          charMs: 52, linePause: 440, holdMs: 1800,
        }), 1600);
      }

      if (willCompleteAct) {
        const delay = act?.completeDelayMs ?? (act?.endSequence ? 2000 : 3200);
        setTimeout(() => window.ForestActs?.completeAct(), delay);
      } else if (Collection.isComplete() && act?.id !== 'park-street') {
        setTimeout(() => document.dispatchEvent(new CustomEvent('allFlowersCollected')), 2000);
      }
    });
    document.addEventListener('collectionReset', updateProgress);
  }

  document.addEventListener('entranceComplete', initProgress);
})();
