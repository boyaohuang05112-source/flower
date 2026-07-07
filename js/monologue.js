(function () {
  'use strict';

  let box, textEl, forestUI, forestApp;
  let isPlaying = false;

  function ensure() {
    box = document.getElementById('dialogue-box');
    textEl = document.getElementById('dialogue-text');
    forestUI = document.getElementById('forest-ui');
    forestApp = document.getElementById('forest-app');
  }

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function cameraPush(world) {
    if (!world) return Promise.resolve();
    const from = world.scrollLeft;
    const to = Math.min(from + 280, world.scrollWidth * 0.08);
    const duration = 4800;

    return new Promise((resolve) => {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 2.8);
        world.scrollLeft = from + (to - from) * ease;
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  async function typeLine(text, charMs = 58) {
    if (!textEl) return;
    textEl.textContent = '';
    for (const ch of text) {
      textEl.textContent += ch;
      await wait(charMs);
    }
  }

  async function showDialogueLines(lines, opts) {
    ensure();
    if (!box || !textEl || !lines?.length) return;

    const speakerEl = document.getElementById('dialogue-speaker');
    const charMs = opts?.charMs || 58;
    const linePause = opts?.linePause || 500;
    const holdMs = opts?.holdMs ?? 2000;

    if (speakerEl) speakerEl.textContent = '我';
    box.classList.remove('is-fade-out');
    box.classList.add('is-visible');

    for (const line of lines) {
      await typeLine(line, charMs);
      await wait(linePause);
    }

    await wait(holdMs);
    box.classList.add('is-fade-out');
    await wait(900);
    box.classList.remove('is-visible', 'is-fade-out');
    textEl.textContent = '';
    if (speakerEl) speakerEl.textContent = '我';
  }

  async function showDialogueExchange(lines, opts) {
    ensure();
    if (!box || !textEl || !lines?.length || isPlaying) return;

    isPlaying = true;
    const speakerEl = document.getElementById('dialogue-speaker');
    const charMs = opts?.charMs || 52;
    const lineHold = opts?.lineHold ?? opts?.linePause ?? 420;
    const holdMs = opts?.holdMs ?? 1800;

    box.classList.remove('is-fade-out');
    box.classList.add('is-visible');

    for (const raw of lines) {
      const entry = typeof raw === 'string' ? { speaker: '我', text: raw } : raw;
      if (speakerEl && entry.speaker) speakerEl.textContent = entry.speaker;
      await typeLine(entry.text || '', charMs);
      await wait(lineHold);
    }

    await wait(holdMs);
    box.classList.add('is-fade-out');
    await wait(900);
    box.classList.remove('is-visible', 'is-fade-out');
    textEl.textContent = '';
    if (speakerEl) speakerEl.textContent = '我';
    isPlaying = false;
  }

  async function showNarration(lines, opts) {
    ensure();
    if (!box || !textEl || !lines?.length || isPlaying) return;

    isPlaying = true;
    const speakerEl = document.getElementById('dialogue-speaker');
    const charMs = opts?.charMs || 50;
    const lineHold = opts?.lineHold ?? 820;
    const blankPause = opts?.blankPause ?? 300;
    const holdMs = opts?.holdMs ?? 1200;

    box.classList.remove('is-fade-out');
    box.classList.add('is-visible', 'is-narration');
    if (speakerEl) speakerEl.textContent = '旁白';

    for (const raw of lines) {
      const text = typeof raw === 'string' ? raw : raw.text;
      if (!text) {
        textEl.textContent = '';
        await wait(blankPause);
        continue;
      }
      await typeLine(text, charMs);
      await wait(lineHold);
    }

    await wait(holdMs);
    box.classList.add('is-fade-out');
    await wait(900);
    box.classList.remove('is-visible', 'is-fade-out', 'is-narration');
    textEl.textContent = '';
    if (speakerEl) speakerEl.textContent = '我';
    isPlaying = false;
  }

  async function playOpening(world) {
    if (isPlaying) return;
    isPlaying = true;
    ensure();

    forestUI?.classList.add('is-hidden');
    forestApp?.classList.add('forest-opening');
    document.body.classList.add('forest-opening');

    const lines = window.GLOBAL_OPENING_LINES || [];
    const actId = window.ACTS?.[window.CURRENT_ACT]?.id;

    await wait(2000);
    await showDialogueLines(lines, { charMs: 54, linePause: 460, holdMs: 2000 });

    forestApp?.classList.remove('forest-opening');
    document.body.classList.remove('forest-opening');
    forestUI?.classList.remove('is-hidden');
    document.dispatchEvent(new CustomEvent('openingMonologueDone'));

    if (actId !== 'entrance' && world) {
      await cameraPush(world);
    } else if (world) {
      world.scrollLeft = 0;
    }

    isPlaying = false;
  }

  async function waitUntilIdle() {
    while (isPlaying) await wait(120);
  }

  async function playEndSequence(seq) {
    if (!seq) return;
    await waitUntilIdle();
    const allLines = seq.lines || [...(seq.part1 || []), ...(seq.part2 || [])];
    const lines = allLines.map((text) => ({ speaker: '我', text }));
    if (lines.length) {
      await showDialogueExchange(lines, { charMs: 50, lineHold: 900, holdMs: 1400 });
    }
  }

  async function playActOpening(lines, opts) {
    if (!lines?.length) return;
    await waitUntilIdle();
    const delay = opts?.delayMs ?? 3000;
    await wait(delay);
    await showDialogueExchange(
      lines.map((text) => ({ speaker: '我', text })),
      { charMs: 52, lineHold: 880, holdMs: 1500, ...opts }
    );
  }

  async function playFirstMeteorSequence(seq) {
    if (!seq) return;
    await waitUntilIdle();

    if (seq.intro) {
      await showDialogueExchange([{ speaker: '我', text: seq.intro }], {
        charMs: 50,
        lineHold: 750,
        holdMs: 600,
      });
    }

    await wait(seq.pauseMs ?? 900);

    const lines = (seq.lines || []).map((text) => ({ speaker: '我', text }));
    if (lines.length) {
      await showDialogueExchange(lines, {
        charMs: 52,
        lineHold: 900,
        holdMs: 1500,
      });
    }
  }

  window.Monologue = {
    playOpening,
    showDialogueLines,
    showDialogueExchange,
    showNarration,
    playEndSequence,
    playActOpening,
    playFirstMeteorSequence,
    waitUntilIdle,
  };
})();
