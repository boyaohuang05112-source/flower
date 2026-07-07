(function () {
  'use strict';

  const WORDS = ['Sunflower', 'Light', 'Walk', 'Bloom', 'Hope', 'Warmth', 'Smile', 'Gift'];

  window.Transitions = {
    play(onComplete) {
      const overlay = document.getElementById('scene-transition');
      if (!overlay) { if (onComplete) onComplete(); return; }

      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      overlay.innerHTML = `<span class="transition-words">${word}</span>`;
      overlay.classList.add('is-active');

      setTimeout(() => {
        overlay.classList.remove('is-active');
        overlay.innerHTML = '';
        if (onComplete) onComplete();
      }, 1600);
    },
  };
})();
