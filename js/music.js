(function () {
  'use strict';

  const SOURCES = ['audio/ambient.mp3', 'audio/ambient.wav'];
  const TARGET_VOLUME = 0.52;
  const FADE_MS = 2800;

  let audio = null;
  let ready = false;
  let playing = false;
  let audible = false;
  let fadeRaf = null;
  let gestureBound = false;

  function cancelFade() {
    if (fadeRaf) {
      cancelAnimationFrame(fadeRaf);
      fadeRaf = null;
    }
  }

  function fadeVolume(to, ms, onDone) {
    if (!audio) {
      onDone?.();
      return;
    }
    cancelFade();
    const from = audio.volume;
    const start = performance.now();

    function step(now) {
      const t = Math.min(1, (now - start) / ms);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      audio.volume = from + (to - from) * eased;
      if (t < 1) {
        fadeRaf = requestAnimationFrame(step);
        return;
      }
      fadeRaf = null;
      onDone?.();
    }

    fadeRaf = requestAnimationFrame(step);
  }

  function trySource(src) {
    return new Promise((resolve, reject) => {
      const el = new Audio(src);
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0;
      let settled = false;

      const finish = (ok) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        el.removeEventListener('canplaythrough', onReady);
        el.removeEventListener('canplay', onReady);
        el.removeEventListener('error', onError);
        if (ok) resolve(el);
        else reject(new Error(`failed: ${src}`));
      };

      const onReady = () => finish(true);
      const onError = () => finish(false);
      const timer = setTimeout(() => finish(true), 4500);

      el.addEventListener('canplaythrough', onReady, { once: true });
      el.addEventListener('canplay', onReady, { once: true });
      el.addEventListener('error', onError, { once: true });
      el.load();
    });
  }

  async function loadAudio() {
    if (ready && audio) return audio;
    for (const src of SOURCES) {
      try {
        audio = await trySource(src);
        ready = true;
        return audio;
      } catch {
        /* try next */
      }
    }
    return null;
  }

  async function startMuted() {
    if (playing) return true;
    const track = await loadAudio();
    if (!track) return false;
    try {
      track.muted = true;
      track.volume = 0;
      if (track.paused) await track.play();
      playing = true;
      return true;
    } catch {
      return false;
    }
  }

  function unmute() {
    if (!audio || audible) return;
    audible = true;
    audio.muted = false;
    fadeVolume(TARGET_VOLUME, FADE_MS);
  }

  async function play() {
    const ok = await startMuted();
    if (!ok) return false;
    unmute();
    return true;
  }

  function bindFirstGesture() {
    if (gestureBound) return;
    gestureBound = true;

    const unlock = () => {
      void play();
      document.removeEventListener('pointerdown', unlock, true);
      document.removeEventListener('keydown', unlock, true);
    };

    document.addEventListener('pointerdown', unlock, true);
    document.addEventListener('keydown', unlock, true);
  }

  async function boot() {
    bindFirstGesture();
    await startMuted();
  }

  window.Music = { play, isPlaying: () => playing };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { void boot(); });
  } else {
    void boot();
  }

  document.addEventListener('loadingComplete', () => { void startMuted(); });
  document.addEventListener('entranceComplete', () => { void play(); });
})();
