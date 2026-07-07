(function () {
  'use strict';

  const welcome = document.getElementById('welcome');
  const windowBtn = document.getElementById('forest-window');
  const canvas = document.getElementById('welcome-float');
  const sceneInner = document.getElementById('window-scene-inner');
  const windowMount = document.getElementById('window-forest-mount');

  if (!welcome || !windowBtn || !canvas) return;

  let ctx, floaters = [], isHovered = false, isEntering = false;
  let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function mountWindow() {
    if (windowMount && window.Illustrations) {
      windowMount.innerHTML = window.Illustrations.buildWindowScene();
    }
  }

  function earlySetup() {
    mountWindow();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function getRect() {
    const scene = windowBtn.querySelector('.window-scene');
    return scene ? scene.getBoundingClientRect() : windowBtn.getBoundingClientRect();
  }

  function createFloater() {
    const r = getRect();
    return {
      x: r.left + r.width * (0.2 + Math.random() * 0.6),
      y: r.top + r.height * (0.3 + Math.random() * 0.5),
      kind: 'petal',
      life: 0,
      maxLife: 200 + Math.random() * 120,
      vx: Math.random() * 0.7 + 0.25,
      vy: (Math.random() - 0.4) * 0.35,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      size: Math.random() * 4 + 3,
      opacity: Math.random() * 0.4 + 0.25,
      wobble: Math.random() * Math.PI * 2,
    };
  }

  function drawFloater(f) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rot + Math.sin(f.wobble) * 0.12);
    const a = f.opacity * (1 - (f.life / f.maxLife) * 0.5);
    ctx.fillStyle = '#F0C848';
    ctx.globalAlpha = a * 0.55;
    ctx.beginPath();
    ctx.ellipse(0, 0, f.size * 1.1, f.size * 0.55, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = a * 0.85;
    ctx.fillStyle = '#F8E070';
    ctx.beginPath();
    ctx.ellipse(0, 0, f.size * 0.65, f.size * 0.35, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rate = isHovered ? 0.045 : 0.022;
    if (Math.random() < rate && !isEntering) floaters.push(createFloater());
    floaters = floaters.filter((f) => {
      f.life++;
      f.wobble += 0.035;
      f.x += f.vx + Math.sin(f.wobble) * 0.2;
      f.y += f.vy;
      f.rot += f.rotSpeed;
      drawFloater(f);
      return f.life < f.maxLife && f.x < canvas.width + 30;
    });
    if (floaters.length > 70) floaters = floaters.slice(-70);
    requestAnimationFrame(animate);
  }

  function parallax() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;
    if (sceneInner && !isEntering) {
      sceneInner.style.transform = `translate(${currentX * 10}px, ${currentY * 6}px)`;
    }
    if (!isEntering) requestAnimationFrame(parallax);
  }

  function resetForestState() {
    const track = document.getElementById('forest-track');
    if (track && window.ForestActs?.initAct1) {
      window.ForestActs.initAct1(track);
      const section = track.querySelector('.act-section');
      window.Butterflies?.destroy?.();
      if (section && window.ACTS?.[0]) {
        window.Butterflies?.init?.(section, window.ACTS[0]);
      }
    }
    window.CURRENT_ACT = 0;
    window.Act4Walk?.destroy?.();
    window.Act3Meteors?.destroy?.();
    window.Act3Fireflies?.destroy?.();
  }

  async function returnFromFinale(flashOpts = {}) {
    if (isEntering) return;

    const wash = document.getElementById('forest-white-wash');
    const fadeIn = flashOpts.fadeIn ?? 2800;
    const fadeOut = flashOpts.fadeOut ?? 2600;

    if (wash) {
      wash.style.transition = `opacity ${fadeIn}ms var(--ease-soft)`;
      wash.classList.remove('is-reveal');
      wash.classList.add('is-active');
      await wait(fadeIn);
    }

    window.Collection?.reset?.();
    resetForestState();

    const forestApp = document.getElementById('forest-app');
    forestApp?.classList.add('is-hidden');
    forestApp?.classList.remove(
      'is-visible',
      'is-front',
      'is-act2',
      'is-act3',
      'is-act4',
      'forest-opening',
      'act-transitioning',
      'forest-prewarm',
      'is-finale-transition'
    );

    document.getElementById('forest-ui')?.classList.add('is-hidden');
    document.getElementById('forest-sunlight')?.classList.remove('is-active');
    document.getElementById('dialogue-box')?.classList.remove('is-visible', 'is-fade-out', 'is-narration');
    document.body.classList.remove('forest-opening');

    isEntering = false;
    floaters = [];
    if (sceneInner) sceneInner.style.transform = '';
    mountWindow();

    welcome.classList.remove('is-hidden', 'is-entering', 'is-leaving');
    welcome.classList.add('is-visible', 'is-revealed');

    if (wash) {
      wash.style.transition = `opacity ${fadeOut}ms var(--ease-soft)`;
      wash.classList.add('is-reveal');
      await wait(fadeOut);
      wash.classList.remove('is-active', 'is-reveal');
      wash.style.transition = '';
    }

    if (location.search) {
      history.replaceState(null, '', location.pathname);
    }

    requestAnimationFrame(parallax);
  }

  function enterForest() {
    if (isEntering) return;
    window.Music?.play?.();
    isEntering = true;
    floaters = [];

    const forest = document.getElementById('forest-app');
    forest?.classList.remove('is-hidden');
    forest?.classList.add('is-visible', 'is-front');

    welcome.classList.remove('is-revealed');
    requestAnimationFrame(() => {
      welcome.classList.add('is-entering', 'is-leaving');
      document.dispatchEvent(new CustomEvent('entranceComplete'));
    });

    setTimeout(() => {
      welcome.classList.remove('is-visible', 'is-entering', 'is-leaving', 'is-revealed');
      welcome.classList.add('is-hidden');
      isEntering = false;
      document.dispatchEvent(new CustomEvent('entranceSettled'));
    }, 1500);
  }

  function init() {
    mountWindow();
    ctx = canvas.getContext('2d');
    resize();
    animate();
    parallax();
    for (let i = 0; i < 6; i++) floaters.push(createFloater());

    windowBtn.addEventListener('mouseenter', () => { isHovered = true; windowBtn.classList.add('is-hovered'); });
    windowBtn.addEventListener('mouseleave', () => { isHovered = false; windowBtn.classList.remove('is-hovered'); });
    windowBtn.addEventListener('click', enterForest);
    windowBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enterForest(); }
    });
    welcome.addEventListener('mousemove', (e) => {
      const rect = welcome.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    });
    window.addEventListener('resize', resize);
  }

  window.Welcome = { returnFromFinale };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', earlySetup);
  } else {
    earlySetup();
  }

  document.addEventListener('loadingComplete', init);
})();
